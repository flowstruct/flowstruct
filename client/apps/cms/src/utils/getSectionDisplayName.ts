import { Section } from '@/features/study-plan/types.ts';
import { getSectionCode } from '@/utils/getSectionCode.ts';

export const getSectionDisplayName = (
  section: Pick<Section, 'name' | 'level' | 'type' | 'position'>
) => {
  const sectionCode = getSectionCode(section);
  const displayName = section.name !== ''
    ? `- ${section.name}`
    : sectionCode.split('.').length > 2
      ? '- General'
      : '';

  return `${sectionCode}: ${section.level} ${section.type} ${displayName}`;
};
