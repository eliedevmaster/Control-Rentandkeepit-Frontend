import { InstructorActionTypes, InstructorActions } from '../actions/instructor.action';
import { Instructor } from '../../models/instructormanagement/instructor'

export interface State {
  instructor: Instructor | null;
  errorMessage: string | null; 
}

export const initialState: State = {
  instructor: JSON.parse(localStorage.getItem('instructor')),
  errorMessage: '',
};

export function reducer(state = initialState, action: InstructorActions): State {
  switch (action.type) {
    case InstructorActionTypes.REGISTER_COMPLETE: {
      return {
        ...state,
        instructor: new Instructor(action.payload.instructor)
      };
    }
    
    case InstructorActionTypes.REGISTER_ERROR: {
      return {
        ...state,
        errorMessage: 'Incorrect Instructor data.'
      };
    }
    case InstructorActionTypes.UPDATE_COMPLETE: {
      return {
        ...state,
        instructor: new Instructor(action.payload.instructor)
      };
    }
    
    case InstructorActionTypes.UPDATE_ERROR: {
      return {
        ...state,
        errorMessage: 'Incorrect Instructor data.'
      };
    }

    case InstructorActionTypes.GET_CURRENT_INSTRUCTOR_COMPLETE: {
      return {
        ...state,
        instructor: new Instructor(action.payload.instructor)
      };
    }
    default: {
      return state;
    }
  }
}

export const selectInstructor = (state: State)  => state.instructor;