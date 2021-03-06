import moment from 'moment';
import Student from './student.js'
import Exam from './exam.js'


const DATE_FORMAT = "DD-MM-YYYY";


export default class ExamList{
  constructor(examListObject) {
    if(examListObject == null){
      this.id = null;
      this.created_at = null;
      this.updated_at = null;
      this.date_exam = null;
      this.examiner = "No Name";
      this.archived = false;
      this.students_exams = [];
    }else{
      this.id = examListObject["id"]
      this.created_at = examListObject["created_at"]
      this.updated_at = examListObject["updated_at"]
      this.date_exam = examListObject["date_exam"]
      this.examiner = examListObject["examiner"]
      this.archived = examListObject["archived"]

      this.students_exams = [];
      if("students_exams" in examListObject && examListObject["students_exams"].length > 0){
        for (var i = 0; i < examListObject["students_exams"].length; i++) {
          let exam = new Exam(examListObject["students_exams"][i], null, null)
          this.students_exams.push(exam);
        }
      }
      this.convertToStudentObject();
      this.momentExamDate();
    }
  }


  momentExamDate(){
      let de = this.date_exam;
      this.date_exam = moment(de).format(DATE_FORMAT);
  }

  convertToStudentObject(){
    if(this.students_exams.length > 0){
      for (var i = 0; i < this.students_exams.length; i++) {
        let student = new Student(this.students_exams[i].student, null);
        this.students_exams[i].student = student;
      }
    }
  }
  // return false if student is not in students_exams list
  checkIfStudentInExamList(studentID){
    if(this.students_exams.length > 0){
      for (var i = 0; i < this.students_exams.length; i++) {
        if(this.students_exams[i].student_id == studentID){
          return [true, i];
        }
      }
    }
    return [false, -1]
  }

  // Add student to students_exams list
  addStudentToStudentsExams(exam){
    if(!this.checkIfStudentInExamList(exam.student_id)[0]){
      this.students_exams.push(exam);
    }
  }

  // Remove student from students_exams list
  removeStudentFromStudentsExams(studentID){
    let check = this.checkIfStudentInExamList(studentID);
    if(check[0]){
      this.students_exams.splice(check[1], 1);
    }
  }

  outExamList(){
    let date = moment(this.date_exam, DATE_FORMAT).format()
    let outStudentsExams = [];
    // Prepare exams to be exported
    for (var i = 0; i < this.students_exams.length; i++) {
      // let exam = copyInstance(this.students_exams[i])
      // console.log(this.students_exams[i].constructor.name)
      let exam = this.students_exams[i].outExam(date)
      // exam.student = this.students_exams[i].student.outStudent();
      // exam.date_exam = date;
      outStudentsExams.push(exam)
    }
    return {
      "id": this.id,
      "date_exam": date,
      "examiner": this.examiner,
      "archived": this.archived,
      "students_exams": outStudentsExams,
    }
  }

  // Archive an dearchive an examList
  archiveAndDearchive(){
    this.archived = !this.archived;
  }
}
// function copyInstance (original) {
//   var copied = Object.assign(
//     Object.create(
//       Object.getPrototypeOf(original)
//     ),
//     original
//   );
//   return copied;
// }