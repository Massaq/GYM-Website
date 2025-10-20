$(document).ready(function() {
    // --- Маска для номеру телефону ---
    $('#phone').inputmask('+38(099)-999-99-99');

    const form = $('#register-form');
    const userTableBody = $('#user-table tbody');

    // --- Валідація в реальному часі ---
    form.find('input, select').on('input change', function() {
        validateField($(this));
    });
    $('input[name="gender"]').on('change', function() {
        validateField($(this));
    });

    // --- Обробка відправки форми ---
    form.on('submit', function(event) {
        event.preventDefault();
        if (validateForm()) {
            addUserToTable();
            form[0].reset();
            $('.error-message').text('');
        }
    });

    function validateField(field) {
        const fieldName = field.attr('name');
        const value = field.val();
        let errorMessage = '';

        switch (fieldName) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) errorMessage = "Email є обов'язковим для заповнення";
                else if (!emailRegex.test(value)) errorMessage = 'Некоректний формат email';
                break;

            case 'password':
                // ✅ НОВІ ПЕРЕВІРКИ ПАРОЛЯ
                const hasUpperCase = /[A-Z]/.test(value);
                const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
                if (!value) {
                    errorMessage = "Пароль є обов'язковим для заповнення";
                } else if (value.length < 6) {
                    errorMessage = 'Пароль має містити щонайменше 6 символів';
                } else if (!hasUpperCase) {
                    errorMessage = 'Пароль має містити хоча б одну велику літеру';
                } else if (!hasSpecialChar) {
                    errorMessage = 'Пароль має містити хоча б один спеціальний символ';
                }
                break;

            case 'last-name':
            case 'first-name':
                if (!value) errorMessage = "Це поле є обов'язковим";
                break;

            case 'gender':
                if (!$('input[name="gender"]:checked').length) errorMessage = 'Будь ласка, оберіть вашу стать';
                break;

            case 'phone':
                if (value && !$('#phone').inputmask("isComplete")) {
                    errorMessage = 'Номер телефону введено не повністю';
                }
                break;

            case 'birthdate':
                // ✅ НОВА ПЕРЕВІРКА ВІКУ
                if (!value) {
                    errorMessage = "Будь ласка, вкажіть вашу дату народження";
                } else {
                    const birthDate = new Date(value);
                    const today = new Date();
                    let age = today.getFullYear() - birthDate.getFullYear();
                    const monthDifference = today.getMonth() - birthDate.getMonth();
                    
                    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                    }

                    if (age < 14) {
                        errorMessage = 'Реєстрація дозволена лише з 14 років';
                    }
                }
                break;

            case 'group':
            case 'file-upload':
                 if (!value) errorMessage = "Будь ласка, зробіть вибір у цьому полі";
                break;
        }
        
        const errorContainer = field.closest('.form-group').find('.error-message');
        errorContainer.text(errorMessage);
        return !errorMessage;
    }

    function validateForm() {
        let isFormValid = true;
        form.find('input, select').each(function() {
            if (!validateField($(this))) {
                isFormValid = false;
            }
        });
        return isFormValid;
    }
    
    function addUserToTable() {
        const newRow = `
            <tr>
                <td><input type="checkbox" class="row-checkbox"></td>
                <td>${$('#first-name').val()}</td>
                <td>${$('#last-name').val()}</td>
                <td>${$('#email').val()}</td>
                <td>${$('#phone').val()}</td>
                <td>${$('#group option:selected').text()}</td>
            </tr>
        `;
        userTableBody.append(newRow);
    }

    $('#select-all').on('click', function() {
        $('.row-checkbox').prop('checked', $(this).prop('checked'));
    });

    $('#delete-selected').on('click', function() {
        $('.row-checkbox:checked').closest('tr').remove();
        $('#select-all').prop('checked', false);
    });

    $('#duplicate-selected').on('click', function() {
        $('.row-checkbox:checked').each(function() {
            const rowToDuplicate = $(this).closest('tr').clone();
            rowToDuplicate.find('.row-checkbox').prop('checked', false);
            userTableBody.append(rowToDuplicate);
        });
    });
});