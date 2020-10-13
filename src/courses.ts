import * as courses from "../data/fa20-courses-simplified.json";

import * as JsSearch from "js-search";

const clean = courses.map(c => ({
    subject: c.subject,
    courseNumber: c.courseNumber,
    title: c.title,
    courseId: `${c.courseId}`
}));

const courseIds = new Set(clean.map(c => c.courseId));

const search = new JsSearch.Search('courseId');
search.addIndex('title');
search.addIndex('subject');
search.addIndex('courseNumber');

search.addDocuments(clean);

export function searchCourse(searchString: string) {
    return search.search(searchString).slice(0, 20);
}

export function isValidCourseId(courseId: string) {
    return courseIds.has(courseId);
}