// Roles: student, teacher
// Disciplines: Computer Science, Mathematics, Physics, Biology, Chemistry
// Academic status: active, academic leave, graduated, expelled

type Role = "student" | "teacher";
type Gender = "male" | "female" | "other";
type Discipline = "Computer Science" | "Mathematics" | "Physics" | "Linguistics" | "Chemistry";
type AcademicStatus = "active" | "graduated" | "academic leave" | "expelled";

let defaultContact: {email: string; phone: string};

defaultContact = {
    email: "info@university.com",
    phone: "+380955555555",
};

interface PersonInfo {
    firstName: string;
    lastName: string;
    birthDate: Date;
    gender: Gender;
    contactInfo: typeof defaultContact;
}

interface CourseInfo {
    name: string;
    discipline: Discipline;
    credits: number;
}

class UniversityError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "UniversityError";
    }
}

class Course {
    constructor(
      public readonly name: string,
      public readonly discipline: Discipline,
      public readonly credits: number
    ) {}
}

class Group {
    private students: Student[] = [];
  
    constructor(
      public readonly name: string,
      public readonly course: Course,
      public readonly teacher: Teacher
    ) {}
  
    addStudent(student: Student): void {
      if (this.students.includes(student)) {
        throw new UniversityError('Student is already in the group');
      }
      this.students.push(student);
    }
  
    removeStudentById(id: number): void {
      const index = this.students.findIndex(student => student.id === id);
      if (index === -1) {
        throw new UniversityError('Student not found in group');
      }
      this.students.splice(index, 1);
    }
  
    getAverageGroupScore(): number {
      if (this.students.length === 0) {
        return 0;
      }
      const totalScore = this.students.reduce(
        (sum, student) => sum + student.getAverageScore(),
        0
      );
      return totalScore / this.students.length;
    }
  
    getStudents(): ReadonlyArray<Student> {
      return [...this.students];
    }

    getStudentById(idIds: number | number[]): Student | Student[] | undefined {
        // Add the ability to pass a single identifier and an array of identifiers
        if (Array.isArray(idIds)) {
            const students = this.students.filter(student => idIds.includes(student.id));
            if (students.length === 0) {
                throw new UniversityError('No students found for the provided IDs');
            }
            return students;
        } else {
            const student = this.students.find(student => student.id === idIds);
            if (!student) {
                throw new UniversityError('Student not found for the providedID');
            }
            return student;
        }  
    }
}

class Person {
    private static nextId = 1;
    public readonly id: number;
  
    constructor(
      public readonly firstName: string,
      public readonly lastName: string,
      public readonly birthDay: Date,
      public readonly gender: string,
      public readonly contactInfo: typeof defaultContact,
      public readonly role: Role,
    ) {
      this.id = Person.nextId++;
    }
  
    get fullName(): string {
      return `${this.lastName} ${this.firstName}`;
    }
  
    get age(): number {
      const today = new Date();
      let age = today.getFullYear() - this.birthDay.getFullYear();
      const monthDiff = today.getMonth() - this.birthDay.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.birthDay.getDate())) {
        age--;
      }
      return age;
    }
}

class Teacher extends Person {
    private specializations: Discipline[] = [];
    private courses: Course[] = [];
  
    constructor(
      info: PersonInfo,
      specializations: Discipline[] = []
    ) {
      super(info.firstName, info.lastName, info.birthDate, info.gender, { email: info.contactInfo.email, phone: info.contactInfo.phone }, 'teacher');
      this.specializations = specializations;
    }
  
    assignCourse(course: Course): void {
      this.courses.push(course);
    }
  
    removeCourse(courseName: string): void {
      this.courses = this.courses.filter(course => course.name !== courseName);
    }
  
    getCourses(): ReadonlyArray<Course> {
      return [...this.courses];
    }
}

class Student extends Person {
    private academicPerformance = {
      totalCredits: 0,
      gpa: 0,
    };
    private enrolledCourses: Course[] = [];
    private status: AcademicStatus = 'active';
  
    constructor(info: PersonInfo) {
      super(info.firstName, info.lastName, info.birthDate, info.gender, { email: info.contactInfo.email, phone: info.contactInfo.phone }, 'student');
    }
  
    enrollCourse(course: Course): void {
      if (this.status !== 'active') {
        throw new UniversityError('Cannot enroll: Student is not in active status');
      }
      this.enrolledCourses.push(course);
      this.academicPerformance.totalCredits += course.credits;
    }
  
    getAverageScore(): number {
      return this.academicPerformance.gpa;
    }
  
    updateAcademicStatus(newStatus: AcademicStatus): void {
      this.status = newStatus;
    }
  
    getEnrolledCourses(): ReadonlyArray<Course> {
      return [...this.enrolledCourses];
    }
  }

  class University {
    private courses: Course[] = [];
    private groups: Group[] = [];
    private people: Person[] = [];
  
    constructor(public readonly name: string) {}
  
    addCourse(course: Course): void {
      this.courses.push(course);
    }
  
    addGroup(group: Group): void {
      this.groups.push(group);
    }
  
    addPerson(person: Person): void {
      this.people.push(person);
    }
  
    findGroupByCourse(course: Course): Group | undefined {
      return this.groups.find(group => group.course === course);
    }
  
    getAllPeopleByRole(role: Role): ReadonlyArray<Person> {
      switch (role) {
        case 'student':
          return this.people.filter(person => person.role === 'student');
        case 'teacher':
          return this.people.filter(person => person.role === 'teacher');
        default:
          return this.assertNeverRole(role);
      }
    }
  
    private assertNeverRole(role: never): never {
      throw new Error(`Unhandled role: ${role}`);
    }
  }
