const deepJson = (values: any): any => {
  if (Array.isArray(values)) {
    return values.map(deepJson);
  }

  if (typeof values === 'object') {
    const obj: any = {};

    Object.keys(values).forEach((key) => {
      obj[key] = deepJson(values[key]);
    });

    return obj;
  }

  try {
    return JSON.parse(values);
  } catch (excpt) {
    return values;
  }  
};

const pJson = (values: any[] = []): Record<any,any> => {
  const obj: any = {};

  values.forEach(([key, ...others]) => {
    obj[key] = deepJson(others);
  });

  return obj;
}

export const callSheet = (spreadsheetId: string, range: string, parser: any = pJson) => {
  return gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId, range,
  }).then((response) => {
    return parser(response.result.values);
  });
}

export const loadCoreData = () => new Promise((resolve, reject) => {
  gapi.load('client:auth2', () => {
    gapi.client.init({
      apiKey: process.env.REACT_APP_SHEETS_API_KEY,
      clientId: process.env.REACT_APP_SHEETS_CLIENT_ID,
      discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
      scope: "https://www.googleapis.com/auth/spreadsheets.readonly"
    }).then(function () {
      return callSheet(process.env.REACT_APP_SHEETS_CORE_STUFF || '', 'core', (arr: any) => {
        const obj: any = {};
        arr.forEach(([k, v]: string[]) => obj[k] = v);
        return resolve(obj);
      });
    }, function(error) {
      reject(error);
    });
  });
});
  
