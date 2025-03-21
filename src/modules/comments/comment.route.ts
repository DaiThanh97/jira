import { Router } from "express";
import Container from "typedi";
import { CommentController } from "./comment.controller";

const commentRoutes = Router();
const commentController = Container.get(CommentController);

commentRoutes.post("/", commentController.createComment);
commentRoutes.get("/tasks/:id", commentController.getAllComments);
commentRoutes.delete("/:id", commentController.deleteComment);

export default commentRoutes;
