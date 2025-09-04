import { Button, Container, Stack, Title } from '@mantine/core';
import { ArrowLeft, SearchX } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { DefaultSearchValues } from '@/utils/defaultSearchValues.ts';

export function NotFoundPage() {
  return (
    <Container size={420} mt={150}>
      <Stack align="center" gap="lg">
        <SearchX color="red" size={70} />
        <Title>(404) Not found...</Title>
        <Link
          to="/catalog/programs"
          search={DefaultSearchValues()}
          style={{ textDecoration: 'none', display: 'block', width: '100%' }}
        >
          <Button size="xl" variant="transparent" fullWidth leftSection={<ArrowLeft />}>
            Go back home
          </Button>
        </Link>
      </Stack>
    </Container>
  );
}
