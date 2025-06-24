// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/db-mysql');
// const bcrypt = require('bcryptjs');

// // define the user schema
// const User = sequelize.define('User', {
//   user_id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   username: {
//     type: DataTypes.STRING(50),
//   },
//   email: {
//     type: DataTypes.STRING(100),
//     allowNull: false,
//     unique: true,
//     validate: {
//       isEmail: true,
//     },
//   },
//   password: {
//     type: DataTypes.STRING(255),
//     allowNull: false,
//   },
//   full_name: {
//     type: DataTypes.STRING(100),
//     unique: true,
//     allowNull: false,
//   },
//   address: {
//     type: DataTypes.TEXT,
//   },
//   phone_number: {
//     type: DataTypes.STRING(20),
//   },
//   date_of_birth: {
//     type: DataTypes.DATEONLY,
//   },
//   role: {
//     type: DataTypes.ENUM('admin', 'customer'),
//     defaultValue: 'customer',
//     allowNull: false,
//   },
// }, {
//   tableName: 'Users',
//   timestamps: true, // Let Sequelize manage createdAt and updatedAt
//   createdAt: 'created_at',
//   updatedAt: false, // We only have created_at in our schema
//   hooks: {
//     // This hook will automatically hash the password before a user is created
//     beforeCreate: async (user) => {
//       if (user.password) {
//         const salt = await bcrypt.genSalt(10);
//         user.password = await bcrypt.hash(user.password, salt);
//       }
//     },
//   },
// });

// // Instance method to compare passwords
// User.prototype.comparePassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// module.exports = User;


//Update hari ini 24 Juni 2025


const { DataTypes } = require('sequelize');
const sequelize = require('../config/db-mysql');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

module.exports = User;