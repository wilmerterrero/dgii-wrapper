const phantom = require("phantom");
const timeoutPromise = require("../utils/timeoutPromise");

const url =
  "https://dgii.gov.do/app/WebApps/ConsultasWeb2/ConsultasWeb/consultas/ncf.aspx";

async function checkNCF(rnc, ncf) {
  // prevent empty values
  if (!rnc || !ncf) return;

  // phanthom config
  const instance = await phantom.create();
  const page = await instance.createPage();

  /* ----------------------------logs-------------------------------- */
  // await page.on("onResourceRequested", function (requestData) {
  //   console.info("Requesting", requestData.url);
  // });
  // await page.on("onConsoleMessage", function (msg) {
  //   console.info(msg);
  // });
  /* ----------------------------logs-------------------------------- */

  await page.open(url);

  /* ----------------------------Submit values-------------------------------- */
  await page.evaluate(
    function (rnc, ncf) {
      document.getElementById("cphMain_txtRNC").value = rnc; //RNC
      document.getElementById("cphMain_txtNCF").value = ncf; //NCF
      document.getElementById("cphMain_btnConsultar").click(); // click submit button
    },
    rnc, // passing arguments from params
    ncf
  );
  /* ----------------------------Submit values-------------------------------- */

  await timeoutPromise(1500);

  // Get only the table contents
  const result = await page.evaluate(function () {
    // performance begin
    const perf1 = window.performance.now();

    /* ----------------------------Results-------------------------------- */
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
    /* ----------------------------Results-------------------------------- */

    // performance end
    const perf2 = window.performance.now();

    const data = {
      timeRequested: perf2 - perf1,
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

  return result;
}

module.exports = checkNCF;
