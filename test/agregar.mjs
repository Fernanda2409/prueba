const { expect } = require('chai');
const sinon = require('sinon');
const fetchMock = require('fetch-mock');

// Funciones importadas o copiadas del archivo original
function validatePrecio(precio) {
    return precio > 0;
}

function validateMetrosCuadrados(metrosCuadrados) {
    return metrosCuadrados > 0;
}

function validateHabitaciones(habitaciones) {
    return habitaciones >= 1;
}

function validateBanos(banos) {
    return banos >= 1;
}

function validateCodigoPostal(codigoPostal) {
    return codigoPostal.length === 5 && !isNaN(codigoPostal);
}

describe('Validaciones de formularios', () => {
    it('validatePrecio retorna true para precios mayores a 0', () => {
        expect(validatePrecio(100)).to.be.true;
    });

    it('validatePrecio retorna false para precios menores o iguales a 0', () => {
        expect(validatePrecio(0)).to.be.false;
        expect(validatePrecio(-10)).to.be.false;
    });

    it('validateMetrosCuadrados retorna true para valores mayores a 0', () => {
        expect(validateMetrosCuadrados(50)).to.be.true;
    });

    it('validateMetrosCuadrados retorna false para valores menores o iguales a 0', () => {
        expect(validateMetrosCuadrados(0)).to.be.false;
        expect(validateMetrosCuadrados(-30)).to.be.false;
    });

    it('validateHabitaciones retorna true para valores mayores o iguales a 1', () => {
        expect(validateHabitaciones(1)).to.be.true;
        expect(validateHabitaciones(3)).to.be.true;
    });

    it('validateHabitaciones retorna false para valores menores a 1', () => {
        expect(validateHabitaciones(0)).to.be.false;
        expect(validateHabitaciones(-1)).to.be.false;
    });

    it('validateBanos retorna true para valores mayores o iguales a 1', () => {
        expect(validateBanos(1)).to.be.true;
        expect(validateBanos(2)).to.be.true;
    });

    it('validateBanos retorna false para valores menores a 1', () => {
        expect(validateBanos(0)).to.be.false;
        expect(validateBanos(-2)).to.be.false;
    });

    it('validateCodigoPostal retorna true para códigos postales válidos', () => {
        expect(validateCodigoPostal('12345')).to.be.true;
    });

    it('validateCodigoPostal retorna false para códigos postales inválidos', () => {
        expect(validateCodigoPostal('1234')).to.be.false;
        expect(validateCodigoPostal('abcde')).to.be.false;
        expect(validateCodigoPostal('')).to.be.false;
    });
});

describe('Alertas del formulario', () => {
    let Swal;

    beforeEach(() => {
        Swal = {
            fire: sinon.spy()
        };
        global.Swal = Swal;
    });

    it('showAlert llama a Swal.fire con los argumentos correctos', () => {
        const showAlert = (icon, title, text) => {
            Swal.fire({
                icon: icon,
                title: title,
                text: text,
                confirmButtonColor: '#3AB397'
            });
        };

        showAlert('error', 'Error de prueba', 'Este es un mensaje de error.');

        expect(Swal.fire.calledOnce).to.be.true;
        expect(Swal.fire.firstCall.args[0]).to.deep.equal({
            icon: 'error',
            title: 'Error de prueba',
            text: 'Este es un mensaje de error.',
            confirmButtonColor: '#3AB397'
        });
    });
});
