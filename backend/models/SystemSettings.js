import mongoose from 'mongoose';

const systemSettingsSchema = new mongoose.Schema({
  settingKey: {
    type: String,
    required: true,
    unique: true
  },
  settingValue: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  description: String,
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Static method to get or create a setting
systemSettingsSchema.statics.getSetting = async function(key, defaultValue = null) {
  try {
    const setting = await this.findOne({ settingKey: key });
    return setting ? setting.settingValue : defaultValue;
  } catch (error) {
    console.error('Error getting setting:', error);
    return defaultValue;
  }
};

// Static method to set a setting
systemSettingsSchema.statics.setSetting = async function(key, value, updatedBy = null, description = null) {
  try {
    const setting = await this.findOneAndUpdate(
      { settingKey: key },
      { 
        settingValue: value, 
        updatedBy,
        description,
        updatedAt: new Date()
      },
      { 
        upsert: true, 
        new: true,
        setDefaultsOnInsert: true
      }
    );
    return setting;
  } catch (error) {
    console.error('Error setting setting:', error);
    throw error;
  }
};

export default mongoose.model('SystemSettings', systemSettingsSchema);