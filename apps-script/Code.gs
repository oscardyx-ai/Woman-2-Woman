// Paste this into the Apps Script editor of the Google Sheet you want responses to land in.
// Extensions > Apps Script, replace the default content with this file, then deploy as a Web App.

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp',
      'First Name',
      'Last Name',
      'Age',
      'WhatsApp Number',
      'Email',
      'Future Career',
      'Why',
      'Dream Job',
    ]);
  }

  sheet.appendRow([
    new Date(),
    data.firstName || '',
    data.lastName || '',
    data.age || '',
    data.whatsapp || '',
    data.email || '',
    data.futureCareer || '',
    data.whyCareer || '',
    data.dreamJob || '',
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
