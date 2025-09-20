import { Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Resizable } from 're-resizable';
import { useComponentMediaQuery } from 'use-component-media-query';
import size2color, { color2CssColor } from '../size2color';

type Story = StoryObj<typeof Component>;

export const Component = () => {
  const { dimension, ref } = useComponentMediaQuery({});
  const color = color2CssColor(size2color(dimension));
  return (
    <Resizable
      style={{ border: '1px solid black' }}
      defaultSize={{ height: '200px', width: '400px' }}
    >
      <Box ref={ref} width="100%" height="100%" bgcolor={color} />
    </Resizable>
  )
};

const meta: Meta<typeof Component> = {
  title: 'UseComponentMediaQuery/Component',
};
export default meta;