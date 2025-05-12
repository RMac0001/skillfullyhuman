'use client';
import { Button, type ButtonProps } from '@chakra-ui/react';

export const PrimaryButton = (props: ButtonProps) => {
  return (
    <Button
      bg="brand.500"
      color="white"
      _hover={{ bg: 'brand.700' }}
      {...props}
    />
  );
};
