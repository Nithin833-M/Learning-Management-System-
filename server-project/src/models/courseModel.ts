import { Sequelize, DataTypes } from 'sequelize';\nimport sqlite3 from 'sqlite3';\n\nconst sequelize = new Sequelize({\n  dialect: 'sqlite',\n  storage: 'database.sqlite',\n  dialectModule: sqlite3,\n  logging: false,\n});\n\nconst Course = sequelize.define('Course', {\n  courseId: {\n    type: DataTypes.STRING,\n    allowNull: false,\n    primaryKey: true,\n  },\n  title: {\n    type: DataTypes.STRING,\n    allowNull: false,\n  },\n}, {\n  timestamps: true,\n});\n\nasync function syncDatabase() {\n  try {\n    await sequelize.sync();\n    console.log('Database synchronized successfully.');\n  } catch (error) {\n    console.error('Error synchronizing database:', error);\n  }\n}\n\nexport { Course, syncDatabase };
