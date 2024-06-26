const lectureController = require("../controllers/lectureController");

const lectureRoute = (app) => {
    app.get("/lectures", lectureController.getAllLectures);
    app.get("/lectures/course-with-lecture", lectureController.getCourseWithLecture);
    app.get("/lectures/search", lectureController.searchLectures);
    app.get("/lectures/:id", lectureController.getLectureById);
    app.get("/lectures/:lectureID/sublectures/:subLectureID", lectureController.getSubLectureById); 
    app.post("/lectures", lectureController.createLecture);
    app.put("/lectures/:id", lectureController.updateLecture);
    app.delete("/lectures/:id", lectureController.deleteLecture);

    app.get("/courses/:courseID/lectures", lectureController.getCourseWithLecture);

    app.get("/courses/:courseID/lectures/without-video", lectureController.getCourseWithLectureWithoutVideo);

};

module.exports = lectureRoute;