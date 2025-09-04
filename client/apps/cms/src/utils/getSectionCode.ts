import { Section, SectionLevel, SectionType } from '@/features/study-plan/types.ts';

export const getSectionCode = (section: Pick<Section, 'level' | 'type' | 'position'>) => {
  let code = '';

  code += getSectionLevelCode(section.level);
  code += '.' + getSectionTypeCode(section.type);

  return (code += section.position > 0 ? '.' + section.position : '');
};

export const getSectionLevelCode = (level: SectionLevel) => {
  let code = '';

  switch (level) {
    case SectionLevel.University:
      code += '1';
      break;
    case SectionLevel.School:
      code += '2';
      break;
    case SectionLevel.Program:
      code += '3';
      break;
    default:
      return;
  }

  return code;
};

export const getSectionTypeCode = (type: SectionType) => {
  let code = '';

  switch (type) {
    case SectionType.Requirement:
      code += '1';
      break;
    case SectionType.Elective:
      code += '2';
      break;
    case SectionType.Remedial:
      code += '3';
      break;
    default:
      return;
  }

  return code;
};
