import React from "react";

import type { Meta, StoryObj } from "@storybook/react";

import { Card, Heatmap } from "components";

const data = [
    { x: "A", y: "1", value: 1 },
    { x: "A", y: "2", value: 2 },
    { x: "A", y: "3", value: 3 },
    { x: "A", y: "4", value: 4 },
    { x: "A", y: "5", value: 5 },
    { x: "A", y: "6", value: 6 },
    { x: "A", y: "7", value: 7 },
    { x: "A", y: "8", value: 8 },
    { x: "A", y: "9", value: 9 },
    { x: "A", y: "10", value: 10 },
    { x: "B", y: "1", value: 1 },
    { x: "B", y: "2", value: 2 },
    { x: "B", y: "3", value: 3 },
    { x: "B", y: "4", value: 4 },
    { x: "B", y: "5", value: 5 },
    { x: "B", y: "6", value: 6 },
    { x: "B", y: "7", value: 7 },
    { x: "B", y: "8", value: 8 },
    { x: "B", y: "9", value: 9 },
    { x: "B", y: "10", value: 10 },
    { x: "C", y: "1", value: 1 },
    { x: "C", y: "2", value: 2 },
    { x: "C", y: "3", value: 3 },
    { x: "C", y: "4", value: 4 },
    { x: "C", y: "5", value: 5 },
    { x: "C", y: "6", value: 6 },
    { x: "C", y: "7", value: 7 },
    { x: "C", y: "8", value: 8 },
    { x: "C", y: "9", value: 9 },
    { x: "C", y: "10", value: 10 },
    { x: "D", y: "1", value: 1 },
    { x: "D", y: "2", value: 2 },
    { x: "D", y: "3", value: 3 },
    { x: "D", y: "4", value: 4 },
    { x: "D", y: "5", value: 5 },
    { x: "D", y: "6", value: 6 },
    { x: "D", y: "7", value: 7 },
    { x: "D", y: "8", value: 8 },
    { x: "D", y: "9", value: 9 },
    { x: "D", y: "10", value: 10 },

];

const meta: Meta<typeof Heatmap> = {
  title: "Visualizations/Vis/Heatmap",
  component: Heatmap,
  args: {
    data: data,
    xLabels: ["A", "B", "C", "D"],
    yLabels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    steps: [2.5, 5, 7.5, 10]
  },
  render: (args) => <Heatmap {...args} />,
  parameters: {
    sourceLink:
      "https://github.com/tremorlabs/tremor/tree/main/src/components/vis-elements/Heatmap",
  },
};

export default meta;
type Story = StoryObj<typeof Heatmap>;

export const Default: Story = {
    args: {},
};

export const With2Steps: Story = {
    args: {
        steps: [2, 10]
    },
};

export const With5Steps: Story = {
    args: {
        steps: [2, 4, 6, 8, 10]
    },
};