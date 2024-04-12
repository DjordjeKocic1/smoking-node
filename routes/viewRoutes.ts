import { Router } from "express";
import path from "path";

export const viewRoutes = (router: Router) => {
  router.get("/", (req, res, next) => {
    res.redirect("/admin/login");
  });

  router.get("/admin/login", (req, res, next) => {
    res.sendFile(path.join(__dirname, "../", "views/admin/", "login.html"));
  });

  router.get("/admin/users", (req: any, res: any, next: any) => {
    res.sendFile(path.join(__dirname, "../", "views/admin/", "users.html"));
  });

  router.get("/account/delete/login", (req, res, next) => {
    res.sendFile(path.join(__dirname, "../", "views/account/", "login.html"));
  });
  router.get("/account/delete/request", (req, res, next) => {
    res.sendFile(path.join(__dirname, "../", "views/account/", "delete.html"));
  });
  router.get("/account/delete/success", (req, res, next) => {
    res.sendFile(path.join(__dirname, "../", "views/account/", "success.html"));
  });
  router.get("/account/registration/verification", (req, res, next) => {
    res.sendFile(
      path.join(__dirname, "../", "views/account/", "verification.html")
    );
  });
  router.get(
    "/account/registration/generate-password?:token",
    (req, res, next) => {
      res.sendFile(
        path.join(__dirname, "../", "views/account/", "password.html")
      );
    }
  );
};
