import {Anchor, Button, CopyButton, Group, Stack} from '@mantine/core';
import {Copy, ExternalLink} from 'lucide-react';
import {STUDY_PLAN_ENDPOINT} from '@/features/study-plan/constants.ts';

const CONTENT_DOMAIN = 'http://localhost:4321';

type Props = {
    studyPlanId: number;
};

export function StudyPlanStudentViewLink({studyPlanId}: Props) {
    const link = `${CONTENT_DOMAIN}${STUDY_PLAN_ENDPOINT}/${studyPlanId}`;

    return (
        <Stack>
            <Group justify="space-between">
                <Group>
                    <ExternalLink color="gray" size={14}/>
                    <Anchor style={{flex: 1}} href={link} target="_blank" rel="noopener noreferrer">
                        {link}
                    </Anchor>
                </Group>
                <CopyButton value={link}>
                    {({copied, copy}) => (
                        <Button
                            leftSection={copied ? null : <Copy size={18}/>}
                            color={copied ? 'teal' : 'blue'}
                            onClick={copy}
                        >
                            {copied ? 'Copied' : 'Copy URL'}
                        </Button>
                    )}
                </CopyButton>
            </Group>
        </Stack>
    );
}
