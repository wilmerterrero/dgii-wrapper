var phantom = require("phantom");

var url =
  "https://dgii.gov.do/app/WebApps/ConsultasWeb2/ConsultasWeb/consultas/ncf.aspx";

// A promise to wait for n of milliseconds
const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async function () {
  const instance = await phantom.create();
  const page = await instance.createPage();

  await page.on("onResourceRequested", function (requestData) {
    console.info("Requesting", requestData.url);
  });
  await page.on("onConsoleMessage", function (msg) {
    console.info(msg);
  });

  const status = await page.open(url);
  await console.log("STATUS:", status);

  // // submit
  await page.evaluate(function () {
    document.getElementById("cphMain_txtRNC").value = "401037272"; //RNC
    document.getElementById("cphMain_txtNCF").value = "B0216007680"; //NCF
    document.getElementById("cphMain_btnConsultar").click(); // click submit button
  });

  console.log("Waiting 1.5 seconds..");
  await timeout(1500);

  // // Get only the table contents
  const result = await page.evaluate(function () {
    // The results are in cphMain_pResultado
    const rnc = document.getElementById("cphMain_lblRncCedula").innerText;
    const razonSocial = document.getElementById(
      "cphMain_lblRazonSocial"
    ).innerText;
    const tipoComprobante = document.getElementById(
      "cphMain_lblTipoComprobante"
    ).innerText;
    const ncf = document.getElementById("cphMain_lblNCF").innerText;
    const estado = document.getElementById("cphMain_lblEstado").innerText;
    const vigencia = document.getElementById("cphMain_lblVigencia").innerText;
    const data = {
      rnc: rnc,
      razonSocial: razonSocial,
      tipoComprobante: tipoComprobante,
      ncf: ncf,
      estado: estado,
      vigencia: vigencia,
    };

    return data;
  });

  await instance.exit();

  console.log(result);
})();
