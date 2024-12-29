import NFLPlayer from '../models/NFLPlayer'; // Adjust the path if necessary
import sequelize from '../config/database';

const changeExperience = async () => {
  try {
    // Connect to the database
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Fetch all players
    const players = await NFLPlayer.findAll({ attributes: ['id', 'experience'] });

    for (const player of players) {
      const experienceString = String(player.experience); // Ensure it's a string
      const experienceNumber = parseInt(experienceString.replace(/\D/g, ''), 10);

      if (!isNaN(experienceNumber)) {
        await player.update({ experience: experienceNumber });
        console.log(`Updated player ${player.id}: Experience set to ${experienceNumber}`);
      } else {
        console.warn(`Invalid experience format for player ${player.id}: ${experienceString}`);
      }
    }

    console.log('All player experiences updated successfully.');
  } catch (error) {
    console.error('Error updating experience:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
    console.log('Database connection closed.');
  }
};

changeExperience();
