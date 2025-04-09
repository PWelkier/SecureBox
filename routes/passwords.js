const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const asyncHandler = require("express-async-handler");
const CustomError = require("../utils/customError");
const {
  getPasswordByUserId,
  createPassword,
  getPasswordByUserPlatformLogin,
  updatePassword,
  deletePassword,
} = require("../config/db/queries/password");
const {
  createPasswordFile,
  updatePasswordFile,
  deletePasswordFile,
  createUserFilesZip,
} = require("../utils/fileHandler");

router.get(
  "/",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const passwords = await getPasswordByUserId(req.user.id);
    res.json(passwords);
  })
);

router.get(
  "/:user_id/files",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { user_id } = req.params;
    if (user_id !== req.user.id)
      return res.status(403).json({ detail: "Forbidden" });
    createUserFilesZip(user_id, res);
  })
);

router.post(
  "/:user_id/files",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { user_id: userId } = req.params;
    const { password, platform, login, logo } = req.body;
    if (userId !== req.user.id) throw new CustomError("Frobidden", 403);
    const filename = await createPasswordFile(userId, password);
    const id = await createPassword({
      passwordfile: filename,
      logo: "https://img.freepik.com/darmowe-wektory/nowy-projekt-ikony-x-logo-twittera-2023_1017-45418.jpg?semt=ais_hybrid",
      platform,
      login,
      userId,
    });
    res
      .status(201)
      .json({ id, passwordfile: filename, logo, platform, login, userId });
  })
);
// creates new file after every valid request ???
router.put(
  "/:user_id/passwords/:platform/:login",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { user_id: userId, platform, login } = req.params;
    const { new_password } = req.body;
    if (userId !== req.user.id) throw new CustomError("Forbidden", 403);
    const [loginCredentials] = await getPasswordByUserPlatformLogin(
      userId,
      platform,
      login
    );
    if (!loginCredentials) throw new CustomError("Password not found", 404);
    const newFilename = await updatePasswordFile(
      userId,
      loginCredentials.passwordfile,
      new_password
    );
    await updatePassword(loginCredentials.id, newFilename);
    res.json({
      id: loginCredentials.id,
      passwordfile: newFilename,
      logo: loginCredentials.logo,
      platform,
      login,
      userId,
    });
  })
);

router.delete(
  "/:user_id/passwords/:platform/:login",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { user_id: userId, platform, login } = req.params;
    if (userId !== req.user.id) throw new CustomError("Forbidden", 403);
    const [loginCredentials] = await getPasswordByUserPlatformLogin(
      userId,
      platform,
      login
    );
    if (!loginCredentials) throw new CustomError("Password not found", 404);
    await deletePasswordFile(userId, loginCredentials.passwordfile);
    await deletePassword(userId, platform, login);
    res.json({ message: `Password for ${platform}/${login} deleted` });
  })
);

router.put(
  "/:user_id/passwords",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { user_id: userId } = req.params;
    const { passwordsall } = req.body;
    if (userId !== req.user.id) throw new CustomError("Forbidden", 403);
    const passwords = await getPasswordByUserId(userId);
    if (passwords.length === 0)
      throw new CustomError("No passwords found", 404);
    const existingKeys = new Set(
      passwords.map((e) => `${e.platform}/${e.login}`)
    );
    const inputKeys = new Set(
      passwordsall.map((p) => `${p.platform}/${p.login}`)
    );
    if (
      existingKeys.size !== inputKeys.size ||
      ![...existingKeys].every((k) => inputKeys.has(k))
    ) {
      throw new CustomError("All accounts must be updated", 400);
    }
    const updatedEntries = [];
    for (const newPasswordData of passwordsall) {
      const { platform, login, new_password } = newPasswordData;
      const entry = passwords.find(
        (e) => e.platform === platform && e.login === login
      );
      if (!entry) continue;
      const newFilename = await updatePasswordFile(
        userId,
        entry.passwordfile,
        new_password
      );
      await updatePassword(entry.id, newFilename);
      updatedEntries.push({
        id: entry.id,
        passwordfile: newFilename,
        logo: entry.logo,
        platform,
        login,
        userId,
      });
    }
    res.json(updatedEntries);
  })
);

module.exports = router;
