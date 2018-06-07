module.exports = function(sequelize, Sequelize) {

    var Stories = sequelize.define('stories', {

        story_id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,

        },

        email: {
            type: Sequelize.STRING,
            allowNull: false,
            onDelete: 'CASCADE',
            references: {
                  model: 'users',
                  key: 'email'
            }

        },

        title: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        story: {
          type: Sequelize.TEXT,
          allowNull: false,
        },

        label: {
          type: Sequelize.STRING,
          allowNull: false,
          get() {
              return this.getDataValue('label').split(';')
          },
          set(val) {
             this.setDataValue('label',val.join(';'));
          },
        },

    });

    return Stories;

}
