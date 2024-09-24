export class QuestionnaireResponseDto {
  id: number;
  title: string;
  headCount: number;
  userId: string;
  content: string;
  createdAt: Date;
}

export class Question {
  id: number;
  text: string;
  questionnaireId: number;
  answers: Answer[];
}

export class Answer {
  id: number;
  content: string;
  questionId: number;
  userId: number;
  createdAt: Date;
}
