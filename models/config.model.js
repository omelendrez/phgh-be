module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('Config',
    {
      appActive: {
        type: DataTypes.TINYINT,
        defaultValue: 0
      },
      appFrozen: {
        type: DataTypes.TINYINT,
        defaultValue: 0
      },
      requireIDCards: {
        type: DataTypes.TINYINT,
        defaultValue: 0
      },
      requireBankStatements: {
        type: DataTypes.TINYINT,
        defaultValue: 0
      },
      daysToBlock: {
        type: DataTypes.TINYINT,
        defaultValue: 0
      },
      daysForGrowth: {
        type: DataTypes.TINYINT,
        defaultValue: 0
      },
      directReferralBonusPercent: {
        type: DataTypes.DECIMAL(4,1),
        defaultValue: 0
      },
      numberOfReferralsForBonus: {
        type: DataTypes.TINYINT,
        defaultValue: 0
      },
      level2ReferralBonusPercent: {
        type: DataTypes.DECIMAL(4,1),
        defaultValue: 0
      },
      level3ReferralBonusPercent: {
        type: DataTypes.DECIMAL(4,1),
        defaultValue: 0
      },
      nextLevelsReferralBonusPercent: {
        type: DataTypes.DECIMAL(4,1),
        defaultValue: 0
      },
      automaticMatching: {
        type: DataTypes.TINYINT,
        defaultValue: 0
      },
      manualMatching: {
        type: DataTypes.TINYINT,
        defaultValue: 0
      },
      mixedMatching: {
        type: DataTypes.TINYINT,
        defaultValue: 0
      },
      showAmountsInDashboard: {
        type: DataTypes.TINYINT,
        defaultValue: 0
      },
      minPHAmount: {
        type: DataTypes.DECIMAL(15,2),
        defaultValue: 0
      },
      maxPHAmount: {
        type: DataTypes.DECIMAL(15,2),
        defaultValue: 0
      },
      percentGrowth: {
        type: DataTypes.DECIMAL(4,1),
        defaultValue: 0
      },
      percentGrowthRecommiemt: {
        type: DataTypes.DECIMAL(4,1),
        defaultValue: 0
      },
      adminsPercent: {
        type: DataTypes.DECIMAL(4,1),
        defaultValue: 0
      },
      adminsPayHoursLimit: {
        type: DataTypes.TINYINT,
        defaultValue: 0
      },
      allowCash: {
        type: DataTypes.TINYINT,
        defaultValue: 0
      },
      allowBitcoins: {
        type: DataTypes.TINYINT,
        defaultValue: 0
      },
      allowMultiplePH: {
        type: DataTypes.TINYINT,
        defaultValue: 0
      },
      messageToPH: {
        type: DataTypes.STRING,
        defaultValue: ''
      },
      daysLimitToRecommit: {
        type: DataTypes.TINYINT,
        defaultValue: 0
      },
      recommitPercent: {
        type: DataTypes.DECIMAL(4,1),
        defaultValue: 0
      },
      bonusRecommitPercent: {
        type: DataTypes.DECIMAL(4,1),
        defaultValue: 0
      },
      daysToRelease: {
        type: DataTypes.TINYINT,
        defaultValue: 0
      },
      messageToGH: {
        type: DataTypes.STRING,
        defaultValue: ''
      }
    }
  )

  Model.prototype.toWeb = function (pw) {
    let json = this.toJSON()
    return json
  }

  return Model
}
