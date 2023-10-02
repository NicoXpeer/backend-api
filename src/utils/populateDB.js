const { models } = require('../types')

// Delete data
const truncateDB = async () => {
  await models.User.deleteMany({}, function (err) {})
  await models.Company.deleteMany({}, function (err) {})
  await models.Tank.deleteMany({}, function (err) {})
  await models.Device.deleteMany({}, function (err) {})
}

const populateDB = async () => {
  // Tanks
  const tank = [
    {
      name: 'Tanque A',
      description: 'Soy un la descipción de un tanque!',
    },
  ]

  const tankList = await models.Tank.create(tank)

  // Device
  const device = [
    {
      state: 'Online',
      tank: tankList[0]._id,
    },
    {
      state: 'Online',
      tank: tankList[0]._id,
    },
  ]

  const deviceList = await models.Device.create(device)

  // Companies
  const companies = [
    {
      name: 'KOA-BIOTECH',
      phone: '1234567',
      address: 'Calle de la piruleta',
      country: 'Spain',
      cif: '123245432456',
    },
    {
      name: 'Test Company',
      phone: '1234567',
      address: 'Calle de la piruleta',
      country: 'Spain',
      cif: '123245432456',
    },
  ]

  const companiesList = await models.Company.create(companies)
  console.log(deviceList[0]._id)
  // Users
  const users = [
    {
      name: 'Super Admin',
      surname1: 'Super Admin',
      surname2: 'Super Admin',
      email: 'superadmin@example.com',
      password: '12345',
      phone: '123456789',
      role: 'SUPER_ADMIN',
      company: companiesList[0]._id,
      devices: deviceList, //deviceList[0]._id,
    },
    {
      name: 'Admin',
      surname1: 'Admin',
      surname2: 'Admin',
      email: 'admin@example.com',
      password: '12345',
      phone: '123456789',
      role: 'ADMIN',
      company: companiesList[0]._id,
    },
    {
      name: 'Basic',
      surname1: 'Basic',
      surname2: 'Basic',
      email: 'basic@example.com',
      password: '12345',
      phone: '123456789',
      role: 'BASIC',
      company: companiesList[0]._id,
    },
  ]

  const userList = await models.User.create(users)

  // const tasks = [
  //   {
  //     name: 'Task 1',
  //     description: 'Description for task 1',
  //     createdBy: adminUser[1]._id,
  //   },
  // ]

  // await models.Task.create(tasks)

  // Task
  // const tasks = [
  //   {
  //     name: 'Task 1',
  //     description: 'Description for task 1',
  //     createdBy: adminUser[1]._id,
  //   },
  //   {
  //     name: 'Task 2',
  //     description: 'Description for task 2',
  //     createdBy: adminUser[1]._id,
  //   },
  //   {
  //     name: 'Task 3',
  //     description: 'Description for task 3',
  //     createdBy: adminUser[1]._id,
  //   },
  //   {
  //     name: 'Task 4',
  //     description: 'Description for task 4',
  //     createdBy: adminUser[1]._id,
  //   },
  //   {
  //     name: 'Task 5',
  //     description: 'Description for task 5',
  //     createdBy: adminUser[1]._id,
  //   },
  //   {
  //     name: 'Task 6',
  //     description: 'Description for task 6',
  //     createdBy: adminUser[2]._id,
  //   },
  //   {
  //     name: 'Task 7',
  //     description: 'Description for task 7',
  //     createdBy: adminUser[1]._id,
  //   },
  //   {
  //     name: 'Task 8',
  //     description: 'Description for task 8',
  //     createdBy: adminUser[1]._id,
  //   },
  //   {
  //     name: 'Task 9',
  //     description: 'Description for task 9',
  //     createdBy: adminUser[1]._id,
  //   },
  //   {
  //     name: 'Task 10',
  //     description: 'Description for task 10',
  //     createdBy: adminUser[2]._id,
  //   },

  // ]

  // await models.Task.create(tasks)
}

module.exports = {
  truncateDB,
  populateDB,
}
