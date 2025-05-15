class UserView {
  constructor() {
    this.registerForm = document.getElementById('registerForm');
    this.loginForm = document.getElementById('loginForm');
    this.profileSection = document.querySelector('.card-body');
    this.editForm = null;
  }

  handleRegister(callback) {
    if (this.registerForm) {
      this.registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const genderInput = this.registerForm.querySelector('input[name="gender"]:checked');
        const gender = genderInput ? genderInput.value : 'Male';
        const formData = {
          email: this.registerForm.querySelector('#inputEmail').value,
          password: this.registerForm.querySelector('#inputPassword').value,
          phone: this.registerForm.querySelector('#inputPhone').value,
          dob: this.registerForm.querySelector('#dob').value,
          gender: gender,
          surveys: []
        };
        console.log('Register form data:', formData);
        callback(formData);
      });
    }
  }

  handleLogin(callback) {
    if (this.loginForm) {
      this.loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = this.loginForm.querySelector('#inputEmail').value;
        const password = this.loginForm.querySelector('#inputPassword').value;
        callback(email, password);
      });
    }
  }

  renderProfile(user) {
    if (this.profileSection && user) {
      console.log('Rendering profile with user:', user);
      const profileTable = document.getElementById('profileTable').getElementsByTagName('tbody')[0];
      profileTable.rows[0].cells[1].textContent = user.surname || 'Not set';
      profileTable.rows[1].cells[1].textContent = user.firstName || 'Not set';
      profileTable.rows[2].cells[1].textContent = user.middleName || 'Not set';
      profileTable.rows[3].cells[1].textContent = user.email || 'Not available';
      profileTable.rows[4].cells[1].textContent = user.phone || 'Not set';
      profileTable.rows[5].cells[1].textContent = user.gender || 'Not set';
      profileTable.rows[6].cells[1].textContent = user.dob || 'Not set';
      const buttons = document.getElementById('profileButtons');
      buttons.innerHTML = `
        <button class="btn btn-primary" id="editProfileBtn"><i class="bi bi-pencil"></i> Edit Profile</button>
        <button class="btn btn-primary" id="signOutBtn">Sign Out</button>
      `;
      document.getElementById('editProfileBtn').addEventListener('click', () => this.showEditForm(user));
      document.getElementById('signOutBtn').addEventListener('click', () => this.handleLogout());
      console.log('Surveys to render:', user.surveys); 
      this.renderSurveys(user.surveys || []);
    } else {
      this.profileSection.innerHTML = '<p>Error: User data not available.</p>';
      console.log('Profile section or user not found:', this.profileSection, user); // Для відладки
    }
  }

  renderSurveys(surveys) {
    const surveysContainer = document.getElementById('surveysContainer');
    console.log('Rendering surveys:', surveys); 
    if (surveys && surveys.length > 0) {
      surveysContainer.innerHTML = '<h6 class="mb-2">Пройдені опитування:</h6><ul class="list-unstyled">';
      surveys.forEach(survey => {
        console.log('Rendering survey:', survey); 
        surveysContainer.innerHTML += `<li class="py-2 border-bottom">${survey.question} - Відповідь: ${survey.answer}</li>`;
      });
      surveysContainer.innerHTML += '</ul>';
    } else {
      surveysContainer.innerHTML = '<p class="text-muted">Ще не пройдено жодного опитування.</p>';
    }
  }

  showEditForm(user) {
    const profileTable = document.getElementById('profileTable').getElementsByTagName('tbody')[0];
    const buttons = document.getElementById('profileButtons');
    profileTable.innerHTML = `
      <tr>
        <th scope="row">Прізвище</th>
        <td><input type="text" class="form-control form-control-sm" id="editSurname" value="${user.surname || ''}"></td>
      </tr>
      <tr>
        <th scope="row">Ім'я</th>
        <td><input type="text" class="form-control form-control-sm" id="editFirstName" value="${user.firstName || ''}"></td>
      </tr>
      <tr>
        <th scope="row">По Батькові</th>
        <td><input type="text" class="form-control form-control-sm" id="editMiddleName" value="${user.middleName || ''}"></td>
      </tr>
      <tr>
        <th scope="row">Email</th>
        <td><input type="email" class="form-control form-control-sm" id="editEmail" value="${user.email || ''}" required></td>
      </tr>
      <tr>
        <th scope="row">Номер телефону</th>
        <td><input type="tel" class="form-control form-control-sm" id="editPhone" value="${user.phone || ''}" required></td>
      </tr>
      <tr>
        <th scope="row">Дата народження</th>
        <td><input type="date" class="form-control form-control-sm" id="editDob" value="${user.dob || ''}" required></td>
      </tr>
      <tr>
        <th scope="row">Стать</th>
        <td>
          <div class="form-check form-check-inline">
            <input type="radio" class="form-check-input" name="editGender" id="editMale" value="Male" ${user.gender === 'Male' ? 'checked' : ''}>
            <label class="form-check-label" for="editMale">Male</label>
          </div>
          <div class="form-check form-check-inline ms-3">
            <input type="radio" class="form-check-input" name="editGender" id="editFemale" value="Female" ${user.gender === 'Female' ? 'checked' : ''}>
            <label class="form-check-label" for="editFemale">Female</label>
          </div>
        </td>
      </tr>
    `;
    buttons.innerHTML = `
      <form id="editForm">
        <button type="submit" class="btn btn-primary w-100">Save Changes</button>
        <button type="button" class="btn btn-secondary w-100 mt-2" id="cancelEditBtn">Cancel</button>
      </form>
    `;
    this.editForm = document.getElementById('editForm');
    this.editForm.addEventListener('submit', (e) => {
      console.log('Save Changes button clicked');
      this.handleEditSubmit(e, user);
    });
    document.getElementById('cancelEditBtn').addEventListener('click', () => this.renderProfile(user));
  }

  handleEditSubmit(e, user) {
    e.preventDefault();
    const updatedData = {
      surname: document.getElementById('editSurname').value,
      firstName: document.getElementById('editFirstName').value,
      middleName: document.getElementById('editMiddleName').value,
      email: document.getElementById('editEmail').value,
      phone: document.getElementById('editPhone').value,
      dob: document.getElementById('editDob').value,
      gender: document.querySelector('input[name="editGender"]:checked')?.value || user.gender
    };
    console.log('Submitting updated data:', updatedData);
    this.handleEdit(updatedData, user);
  }

  handleLogout(callback) {
    const signOutBtn = document.getElementById('signOutBtn');
    if (signOutBtn) {
      signOutBtn.addEventListener('click', callback);
    }
  }

  handleEdit(updatedData, user) {
  }
}