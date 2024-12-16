const { expect } = require("chai");
const sinon = require("sinon");

// Importar las funciones de validación
const {
  validateName,
  validateTelefono,
  validateEmail,
  validatePassword,
  isEmptyOrSpaces
} = require("../path-to-your-code"); // Cambiar por la ruta del archivo

// Funciones auxiliares
function mockSwal() {
  global.Swal = { fire: sinon.stub() };
}

describe("Validaciones de formulario", () => {
  before(() => {
    mockSwal();
  });

  describe("validateName", () => {
    it("debería aceptar nombres válidos", () => {
      expect(validateName("Juan Perez")).to.be.true;
    });

    it("debería rechazar nombres con caracteres inválidos", () => {
      expect(validateName("Juan@Perez")).to.be.false;
    });

    it("debería rechazar nombres muy largos", () => {
      expect(validateName("Juan".repeat(10))).to.be.false;
    });
  });

  describe("validateTelefono", () => {
    it("debería aceptar un número de 10 dígitos", () => {
      expect(validateTelefono("1234567890")).to.be.true;
    });

    it("debería rechazar números con menos de 10 dígitos", () => {
      expect(validateTelefono("12345")).to.be.false;
    });

    it("debería rechazar números con letras", () => {
      expect(validateTelefono("12345abcde")).to.be.false;
    });
  });

  describe("validateEmail", () => {
    it("debería aceptar correos válidos", () => {
      expect(validateEmail("correo@example.com")).to.be.true;
    });

    it("debería rechazar correos sin un dominio válido", () => {
      expect(validateEmail("correo@com")).to.be.false;
    });

    it("debería rechazar cadenas no relacionadas con correos", () => {
      expect(validateEmail("hola mundo")).to.be.false;
    });
  });

  describe("validatePassword", () => {
    it("debería aceptar contraseñas válidas", () => {
      expect(validatePassword("Password123!")).to.be.true;
    });

    it("debería rechazar contraseñas demasiado cortas", () => {
      expect(validatePassword("1234")).to.be.false;
    });

    it("debería rechazar contraseñas demasiado largas", () => {
      expect(validatePassword("12345678901234567890")).to.be.false;
    });
  });

  describe("isEmptyOrSpaces", () => {
    it("debería identificar cadenas vacías", () => {
      expect(isEmptyOrSpaces(" ")).to.be.true;
    });

    it("debería identificar cadenas no vacías", () => {
      expect(isEmptyOrSpaces("texto")).to.be.false;
    });
  });
});

describe("Manejadores de eventos", () => {
  let fetchStub, formSignUp, formSignIn;

  beforeEach(() => {
    fetchStub = sinon.stub(global, "fetch");
    formSignUp = document.createElement("form");
    formSignIn = document.createElement("form");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("Registro de usuario", () => {
    it("debería mostrar un error si los campos están vacíos", () => {
      formSignUp.dispatchEvent(new Event("submit"));
      expect(Swal.fire.calledWithMatch({ icon: "error" })).to.be.true;
    });

    it("debería llamar a fetch con los datos correctos", async () => {
      fetchStub.resolves({ json: () => ({ authenticated: true }) });

      formSignUp.querySelector = sinon.stub().returns({ value: "valor" });
      formSignUp.dispatchEvent(new Event("submit"));

      expect(fetchStub.calledOnce).to.be.true;
    });
  });

  describe("Inicio de sesión", () => {
    it("debería rechazar correos inválidos", () => {
      formSignIn.dispatchEvent(new Event("submit"));
      expect(Swal.fire.calledWithMatch({ icon: "error" })).to.be.true;
    });

    it("debería enviar datos correctos al servidor", async () => {
      fetchStub.resolves({ json: () => ({ authenticated: true }) });

      formSignIn.querySelector = sinon.stub().returns({ value: "test@example.com" });
      formSignIn.dispatchEvent(new Event("submit"));

      expect(fetchStub.calledOnce).to.be.true;
    });
  });
});