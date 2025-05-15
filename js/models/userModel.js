class UserModel {
  constructor() {
    this.users = JSON.parse(localStorage.getItem('users')) || [];
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
  }

  register(userData) {
    const existingUser = this.users.find(u => u.email === userData.email);
    if (!existingUser) {
      this.users.push({ ...userData, surveys: [] });
      localStorage.setItem('users', JSON.stringify(this.users));
    } else {
      throw new Error('User with this email already exists');
    }
  }

  login(email, password) {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    } else {
      throw new Error('Invalid email or password');
    }
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  getCurrentUser() {
    return this.currentUser;
  }

  addSurvey(surveyData) {
    if (this.currentUser) {
      if (!this.currentUser.surveys) {
        this.currentUser.surveys = [];
      }
      this.currentUser.surveys.push(surveyData);

      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

      const userIndex = this.users.findIndex(u => u.email === this.currentUser.email);
      if (userIndex !== -1) {
        this.users[userIndex] = { ...this.users[userIndex], surveys: this.currentUser.surveys };
        localStorage.setItem('users', JSON.stringify(this.users));
      } else {
        throw new Error('User not found in users array');
      }
    } else {
      throw new Error('No current user');
    }
  }

  hasUserAnsweredQuestion(question) {
    if (this.currentUser && this.currentUser.surveys) {
      return this.currentUser.surveys.some(survey => survey.question === question);
    }
    return false;
  }
}