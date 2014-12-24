/**
 * Signup view model
 */
var app = app || {};

app.Signup = (function () {
    'use strict';

    var singupViewModel = (function () {

        var dataSource;
        var $signUpForm;
        var $formFields;
        var $signupBtnWrp;
        var validator;

        // Register user after required fields (username and password) are validated in Backend Services
        var signup = function () {

            dataSource.Gender = parseInt(dataSource.Gender);
            var birthDate = new Date(dataSource.BirthDate);

            if (birthDate.toJSON() === null) {
                birthDate = new Date();
            }

            dataSource.BirthDate = birthDate;
            
            Everlive.$.Users.register(
                dataSource.Username,
                dataSource.Password,
                dataSource);
            var sexo = dataSource.Gender == 2 ? "F" : "M";
                
            
            $.post("http://rtflash.azurewebsites.net/usuario/create",
                {
                    Nombre: dataSource.DisplayName,
                    Rut: dataSource.Username,
                    Email: dataSource.Email,
                    Password: dataSource.Password,
                    Sexo: sexo,
                    FechaNacimiento: dataSource.BirthDate,
                    Descripcion: ""
                },
                function (res) {
                    if (res.ResponseStatus == null) {
                        app.mobileApp.navigate('#welcome');
                    } else {
                        app.showAlert("Ha ocurrido un error al registrarse.");
                    }
                }, "json");
            
        };

        // Executed after Signup view initialization
        // init form validator
        var init = function () {

            $signUpForm = $('#signUp');
            $formFields = $signUpForm.find('input, textarea, select');
            $signupBtnWrp = $('#signupBtnWrp');
            validator = $signUpForm.kendoValidator({ validateOnBlur: false }).data('kendoValidator');

            $formFields.on('keyup keypress blur change input', function () {
                if (validator.validate()) {
                    $signupBtnWrp.removeClass('disabled');
                } else {
                    $signupBtnWrp.addClass('disabled');
                }
            });
        }

        // Executed after show of the Signup view
        var show = function () {

            dataSource = kendo.observable({
                Username: '',
                Password: '',
                DisplayName: '',
                Email: '',
                Gender: '0',
                About: '',
                Friends: [],
                BirthDate: new Date()
            });
            kendo.bind($('#signup-form'), dataSource, kendo.mobile.ui);
        };

        // Executed after hide of the Signup view
        // disable signup button
        var hide = function () {
            $signupBtnWrp.addClass('disabled');
        };

        var onSelectChange = function (sel) {
            var selected = sel.options[sel.selectedIndex].value;
            sel.style.color = (selected == 0) ? '#b6c5c6' : '#34495e';
        }

        return {
            init: init,
            show: show,
            hide: hide,
            onSelectChange: onSelectChange,
            signup: signup
        };

    }());

    return singupViewModel;

}());
