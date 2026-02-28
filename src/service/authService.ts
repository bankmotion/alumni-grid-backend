import User from "../models/User";

export const findOrCreateUser = async (googleUser: {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
}) => {
  const [user, created] = await User.findOrCreate({
    where: { googleId: googleUser.googleId },
    defaults: {
      googleId: googleUser.googleId,
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture || "",
    },
  });

  if (!created) {
    await user.update({
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture || "",
    });
  }

  return user;
};

export const getUserById = async (id: number) => {
  return await User.findByPk(id);
};
