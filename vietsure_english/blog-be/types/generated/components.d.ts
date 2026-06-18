import type { Schema, Struct } from '@strapi/strapi';

export interface TeacherEducations extends Struct.ComponentSchema {
  collectionName: 'components_teacher_educations';
  info: {
    displayName: 'educations';
  };
  attributes: {
    title: Schema.Attribute.String;
  };
}

export interface TeacherExperience extends Struct.ComponentSchema {
  collectionName: 'components_teacher_experiences';
  info: {
    displayName: 'achievements';
  };
  attributes: {
    title: Schema.Attribute.String;
  };
}

export interface TeacherScore extends Struct.ComponentSchema {
  collectionName: 'components_teacher_score_s';
  info: {
    displayName: 'score ';
  };
  attributes: {
    type: Schema.Attribute.Enumeration<['IELTS', 'TOEIC']>;
    vaule: Schema.Attribute.Float;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'teacher.educations': TeacherEducations;
      'teacher.experience': TeacherExperience;
      'teacher.score': TeacherScore;
    }
  }
}
