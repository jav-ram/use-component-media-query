import { Grid } from '@mui/material';
import { Resizable } from 're-resizable';
import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useComponentMediaQuery } from 'use-component-media-query';

import size2color, { color2CssColor } from '../size2color';
const randomInt = (max: number) => { // min and max included 
  return Math.floor(Math.random() * (max - 0 + 1));
}

type ItemPropType = { size: number }
const Item = ({ size }: ItemPropType) => {
  const { dimension, ref } = useComponentMediaQuery({ preload: false });

  const color = color2CssColor(size2color(dimension));
  return <Grid ref={ref} size={size} height="100%" bgcolor={color} />;
};

const MAX_COL_LENGTH = 12;
const Row = () => {
  const [cells, setCells] = useState<number[]>([]);

  useEffect(() => {
    const newCells: number[] = [];
    while (true) {
      const currentSize = newCells.reduce((a, b) => a + b, 0);
      const newCellSize = randomInt(MAX_COL_LENGTH - 1) + 1;
      if (currentSize + newCellSize < MAX_COL_LENGTH) {
        newCells.push(newCellSize);
      } else {
        newCells.push(MAX_COL_LENGTH - currentSize);
        break;
      }
    }
    setCells(newCells);
  }, []);

  return (
    <Grid container direction="column" height="120px" spacing="8px">
      {
        cells.map((size) => (
          <Item size={size} />
        ))
      }
    </Grid >
  )
};

type MultiplePropsType = { rows?: number };
const MultipleTemplate = ({ rows = 1000 }: MultiplePropsType) => {
  const clampNumRows = Math.max(0, rows);
  const rowsArray = Array(clampNumRows).fill(0);
  return (
    <Resizable
      style={{ border: '1px solid black', padding: '10px' }}
      defaultSize={{
        width: '90%'
      }}
    >
      <Grid container direction="column" spacing="8px">
        {rowsArray.map(() => (
          <Row />
        ))}
      </Grid>
    </Resizable>
  )
};

export const Multiple: StoryObj<typeof MultipleTemplate> = {
  args: {
    rows: 100,
  },
  render: MultipleTemplate,
}

const meta: Meta<typeof Multiple> = {
  title: 'UseComponentMediaQuery/Multiple',
};
export default meta;