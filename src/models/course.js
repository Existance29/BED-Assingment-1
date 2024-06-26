const sql = require("mssql");
const dbConfig = require("../database/dbConfig");

class Course {
    constructor(courseID, title, thumbnail, description, details, caption, category, totalRate = 0, ratings = 0, video) {
        this.courseID = courseID;
        this.title = title;
        this.thumbnail = thumbnail;
        this.description = description;
        this.details = details;
        this.caption = caption;
        this.category = category;
        this.totalRate = totalRate;
        this.ratings = ratings;
        this.video = video;
    }

    static async createCourse(newCourseData) {
        try {
            const connection = await sql.connect(dbConfig);
            const sqlQuery = `
                INSERT INTO Courses (Title, Thumbnail, Description, Details, Caption, Category, Video)
                VALUES (@title, @thumbnail, @description, @details, @caption, @category, @video);
                SELECT SCOPE_IDENTITY() AS CourseID;
            `;
            const request = connection.request();
            request.input("title", sql.NVarChar, newCourseData.title);
            request.input("thumbnail", sql.VarBinary, newCourseData.thumbnail);
            request.input("description", sql.NVarChar, newCourseData.description);
            request.input("details", sql.NVarChar, newCourseData.details);
            request.input("caption", sql.NVarChar, newCourseData.caption);
            request.input("category", sql.NVarChar, newCourseData.category);
            request.input("video", sql.VarBinary, newCourseData.video);

            const result = await request.query(sqlQuery);
            connection.close();

            return this.getCourseById(result.recordset[0].CourseID);
        } catch (error) {
            console.error("Database error:", error);
            throw new Error("Error inserting course data");
        }
    }

    static async getAllCourses() {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Courses`;
        const request = connection.request();
        const result = await request.query(sqlQuery);
        connection.close();

        return result.recordset.map(
            (row) => new Course(row.CourseID, row.Title, row.Thumbnail, row.Description, row.Details, row.Caption, row.Category, row.TotalRate, row.Ratings, row.Video)
        );
    }

    static async getAllCoursesWithoutVideo() {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT CourseID, Title, Thumbnail, Description, Details, Caption, Category, TotalRate, Ratings FROM Courses`;
        const request = connection.request();
        const result = await request.query(sqlQuery);
        connection.close();

        return result.recordset.map(
            (row) => new Course(row.CourseID, row.Title, row.Thumbnail, row.Description, row.Details, row.Caption, row.Category, row.TotalRate, row.Ratings)
        );
    }

    static async getCourseById(courseID) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Courses WHERE CourseID = @courseID`;
        const request = connection.request();
        request.input("courseID", sql.Int, courseID);  // Changed this line to explicitly set the type
        const result = await request.query(sqlQuery);

        connection.close();
        if (result.recordset.length === 0) {
            return null;
        }
        return new Course(
            result.recordset[0].CourseID,
            result.recordset[0].Title,
            result.recordset[0].Thumbnail,
            result.recordset[0].Description,
            result.recordset[0].Details,
            result.recordset[0].Caption,
            result.recordset[0].Category,
            result.recordset[0].TotalRate,
            result.recordset[0].Ratings,
            result.recordset[0].Video
        );
    }

    static async updateCourse(courseID, newCourseData) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
            UPDATE Courses SET
                Title = @title,
                Thumbnail = @thumbnail,
                Description = @description,
                Details = @details,
                Caption = @caption,
                Category = @category,
                TotalRate = @totalRate,
                Ratings = @ratings,
                Video = @video
            WHERE CourseID = @courseID;
        `;
        const request = connection.request();
        request.input("courseID", sql.Int, courseID);  // Changed this line to explicitly set the type
        request.input("title", sql.NVarChar, newCourseData.title || null);
        request.input("thumbnail", sql.VarBinary, newCourseData.thumbnail || null);
        request.input("description", sql.NVarChar, newCourseData.description || null);
        request.input("details", sql.NVarChar, newCourseData.details || null);
        request.input("caption", sql.NVarChar, newCourseData.caption || null);
        request.input("category", sql.NVarChar, newCourseData.category || null);
        request.input("totalRate", sql.Int, newCourseData.totalRate || null);
        request.input("ratings", sql.Int, newCourseData.ratings || null);
        request.input("video", sql.VarBinary, newCourseData.video || null);

        await request.query(sqlQuery);

        connection.close();

        return this.getCourseById(courseID);
    }

    static async deleteCourse(courseID) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `DELETE FROM Courses WHERE CourseID = @courseID`;
        const request = connection.request();
        request.input("courseID", sql.Int, courseID);  // Changed this line to explicitly set the type
        const result = await request.query(sqlQuery);

        connection.close();

        return result.rowsAffected > 0;
    }

    static async searchCourses(searchTerm) {
        const connection = await sql.connect(dbConfig);
        try {
            const sqlQuery = `
                SELECT * FROM Courses
                WHERE Title LIKE '%${searchTerm}%'
                OR Description LIKE '%${searchTerm}%'
                OR Details LIKE '%${searchTerm}%'
                OR Caption LIKE '%${searchTerm}%'
                OR Category LIKE '%${searchTerm}%'
            `;
            const request = connection.request();
            const result = await request.query(sqlQuery);
            return result.recordset.map(
                (row) => new Course(row.CourseID, row.Title, row.Thumbnail, row.Description, row.Details, row.Caption, row.Category, row.TotalRate, row.Ratings, row.Video)
            );
        } catch (error) {
            throw new Error("Error searching courses");
        } finally {
            await connection.close();
        }
    }
}

module.exports = Course;
