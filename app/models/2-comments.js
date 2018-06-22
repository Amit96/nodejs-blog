module.exports = function(sequelize, Sequelize) {

    var Comments = sequelize.define('comments', {

        cid: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,

        },

        pcid: {
            type: Sequelize.INTEGER,
            allowNull:true,
            onDelete: 'CASCADE',
            references: {
                  model: 'comments',
                  key: 'cid'
            }

        },

        comment: {
          type: Sequelize.STRING,
          allowNull: false,
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

        story_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          onDelete: 'CASCADE',
          references: {
                model: 'stories',
                key: 'story_id'
          }
        },

        replies_exist: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },


    });

    return Comments;

}
