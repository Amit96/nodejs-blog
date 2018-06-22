module.exports = function(sequelize, Sequelize) {

    var Stories = sequelize.define('stories', {

        story_id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,

        },

        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            onDelete: 'CASCADE',
            references: {
                  model: 'users',
                  key: 'id'
            }

        },

        title: {
          type: Sequelize.STRING,
          allowNull: true,
        },

        story: {
          type: Sequelize.TEXT,
          allowNull: false,
        },

        label: {
          type: Sequelize.STRING,
          allowNull: true,
          /*get() {
              return this.getDataValue('label').split(';')
          },
          set(val) {
             this.setDataValue('label',val.join(';'));
          },*/
        },

    });

    return Stories;

}
