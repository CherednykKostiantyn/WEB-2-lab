class UserController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    window.addEventListener('load', () => {
      const currentPage = window.location.pathname.split('/').pop().toLowerCase();
      if (currentPage === 'quiz.html') {
        this.handleQuizSubmit();
      }
    });
  }

  init() {
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'register.html') {
      this.view.handleRegister(this.handleRegister.bind(this));
    } else if (currentPage === 'login.html') {
      this.view.handleLogin(this.handleLogin.bind(this));
    } else if (currentPage === 'profile.html') {
      const currentUser = this.model.getCurrentUser();
      this.view.renderProfile(currentUser);
      this.view.handleLogout(this.handleLogout.bind(this));
      this.view.handleEdit = this.handleEdit.bind(this);
      if (!currentUser) {
        window.location.href = 'login.html';
      }
    }
  }

  handleRegister(formData) {
    try {
      if (!formData.email || !formData.password || !formData.phone || !formData.dob || !formData.gender) {
        throw new Error('Please fill in all fields');
      }
      if (!formData.email.includes('@')) {
        throw new Error('Invalid email format');
      }
      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      this.model.register(formData);
      alert('Registration successful! Please sign in.');
      window.location.href = 'login.html';
    } catch (error) {
      alert(error.message);
    }
  }

  handleLogin(email, password) {
    try {
      this.model.login(email, password);
      window.location.href = 'profile.html';
    } catch (error) {
      alert(error.message);
    }
  }

  handleLogout() {
    this.model.logout();
    window.location.href = 'index.html';
  }

  handleEdit(updatedData, user) {
    try {
      const users = this.model.users;
      const userIndex = users.findIndex(u => u.email === user.email);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedData };
        this.model.users = users;
        localStorage.setItem('users', JSON.stringify(users));
      } else {
        console.log('User not found in users array');
      }

      this.model.currentUser = { ...this.model.currentUser, ...updatedData };
      localStorage.setItem('currentUser', JSON.stringify(this.model.currentUser));

      alert('Profile updated successfully!');
      this.view.renderProfile(this.model.getCurrentUser());
    } catch (error) {
      alert('Error updating profile: ' + error.message);
      console.log('Error in handleEdit:', error);
    }
  }

  handleQuizSubmit() {
    if (!this.model.getCurrentUser()) {
      alert('Будь ласка, увійдіть, щоб пройти опитування!');
      window.location.href = 'login.html';
      return;
    }

    const forms = [
      { id: 'surveyForm1', question: 'Яка ваша улюблена соціальна мережа?', name: 'survey1' },
      { id: 'surveyForm2', question: 'Який ваш улюблений мобільний бренд?', name: 'survey2' },
      { id: 'surveyForm3', question: 'Яка ваша улюблена мова програмування?', name: 'survey3' }
    ];

    forms.forEach(form => {
      const quizForm = document.getElementById(form.id);
      if (quizForm) {
        quizForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const answer = quizForm.querySelector(`input[name="${form.name}"]:checked`)?.value;
          if (answer) {
            const surveyData = { question: form.question, answer };

            const hasAnswered = this.model.hasUserAnsweredQuestion(form.question);
            if (hasAnswered) {
              alert('Ви вже пройшли це опитування!');
              return;
            }

            try {
              this.model.addSurvey(surveyData);
              alert('Опитування пройдено успішно!');
            } catch (error) {
              alert('Помилка при збереженні опитування: ' + error.message);
            }
          } else {
            alert('Будь ласка, оберіть відповідь!');
          }
        });
      }
    });
  }
}