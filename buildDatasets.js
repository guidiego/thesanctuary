const Bluebird = require('bluebird');
const GoogleSheets = require('google-spreadsheet');
const creds = require('./credentials.json');
const fs = require('fs');
const { promisify } = require('util');

const { writeFile, mkdir, rmdir } = fs.promises;

const getDocument = async (spreadsheetId) => {
  const doc = new GoogleSheets(spreadsheetId);
  await promisify(doc.useServiceAccountAuth)(creds);
  return await promisify(doc.getInfo)();
};

const getRows = async (sheetInfo) => {
  return await promisify(sheetInfo.getRows)();
}

const buildHeroDataFromRow = async (worksheets) => {
  return Bluebird.map(worksheets, async (data) => {
    const [firstData, ...others] = await getRows(data);
    
    const hero = {
      name: firstData.name,
      constelation: firstData.constelation,
      slug: firstData.slug,
      rank: firstData.rank,
      role: [firstData.role],
      skills: [JSON.parse(firstData.skills)],
    };
  
    others.forEach(({ role, skills }) => {
      if (role !== "") {
        hero.role.push(role);
      }
  
      if (skills !== "") {
        hero.skills.push(JSON.parse(skills));
      }
    });

    return hero;
  }, { concurrency: 10 });
};

const sheetMacro = {
  heroes: buildHeroDataFromRow,
}

const populateSheet = async ({ key, value }) => {
  const { worksheets } = await getDocument(value);
  return { [key]: await sheetMacro[key](worksheets) };
};

const loadDatasetInLang = async (sheet) => {
  const rows = await getRows(sheet);
  
  return Bluebird
    .map(rows, populateSheet)
    .reduce((a,c) => ({
      ...a, ...c
    }), { lang: sheet.title });
}

const loadAllLanguageDatasets = async () => {
  const { worksheets } = await getDocument('1qvybkRm3DtJzMoLeZNMNg0urwCIWhBL90Yt8HhJu0qI');
  return Bluebird.map(worksheets, loadDatasetInLang);
};

const clearFolderAndRecreate = async (folder) => {
  if (fs.existsSync(folder)) {
    await rmdir(folder, { recursive: true });
  }
  
  await mkdir(folder);
}

const writeDatasetFiles = async (listOfData) => Bluebird.map(listOfData, async (data) => {
  const { lang, ...datasets } = data;
  const folder = `./src/datasets/${lang}`; 
  await clearFolderAndRecreate(folder);

  return Bluebird.map(Object.keys(datasets), (datasetKey) => {
    return writeFile(
      `${folder}/${datasetKey}.json`,
      JSON.stringify(datasets[datasetKey])
    );
  }).then(() => ({ lang,  availablesDatasets: Object.keys(datasets) }));
});

const writeIndex = async (datasets) => {
  await writeFile(
    './src/datasets/index.json',
    JSON.stringify({ datasets })
  )
}

clearFolderAndRecreate('./src/datasets')
  .then(loadAllLanguageDatasets)
  .then(writeDatasetFiles)
  .then(writeIndex);
