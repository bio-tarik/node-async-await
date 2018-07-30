const users = [{
  id: 1,
  name: 'Tarik',
  schooldId: 101,
},
{
  id: 2,
  name: 'Giza',
  schooldId: 999,
}];

const grades = [{
  id: 1,
  schooldId: 101,
  grade: 73,
},
{
  id: 2,
  schooldId: 999,
  grade: 84,
},
{
  id: 3,
  schooldId: 101,
  grade: 80,
}];

const getUser = (id => new Promise((resolve, reject) => {
  const user = users.find(u => u.id === id);

  if (user) {
    resolve(user);
  } else {
    reject(new Error(`Unable to find user with id of ${id}.`));
  }
}));

const getGrades = (schooldId => (new Promise(
  (resolve) => {
    resolve(grades.filter(grade => grade.schooldId === schooldId));
  },
)));

const getStatus = (userId) => {
  let user;
  return getUser(userId).then((tempUser) => {
    user = tempUser;
    return getGrades(user.schooldId);
  }).then((userGrades) => {
    let average = 0;

    if (userGrades.length > 0) {
      average = userGrades
        .map(g => (average = g.grade))
        .reduce((a, b) => a + b) / userGrades.length;
    }

    return `${user.name} has an average ${average} in the class.`;
  });
};

const getStatusAlt = async (userId) => {
  const user = await getUser(userId);
  const userGrades = await getGrades(user.schooldId);
  let average = 0;

  if (userGrades.length > 0) {
    average = userGrades.map(g => average = g.grade).reduce((a, b) => a + b) / userGrades.length;
  }

  return `${user.name} has an average ${average} in the class.`;
};

getGrades(999)
  .then(grade => console.log(grade))
  .catch(e => console.log(e));

getUser(1)
  .then(user => console.log(user))
  .catch(e => console.log(e));

getStatus(2)
  .then(status => console.log(status))
  .catch(e => console.log(e));

getStatusAlt(2)
  .then(status => console.log(status))
  .catch(e => console.log(e));
