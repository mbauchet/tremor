import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { ComposedChart, Card, Title } from "components";
import { simpleBaseChartData as data, simpleBaseChartDataWithNulls } from "./helpers/testData";
import { valueFormatter } from "./helpers/utils";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Tremor/ChartElements/ComposedChart",
  component: ComposedChart,
} as ComponentMeta<typeof ComposedChart>;
// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const ResponsiveTemplate: ComponentStory<typeof ComposedChart> = (args) => (
  <>
    <Title>Mobile</Title>
    <div className="w-64">
      <Card>
        <ComposedChart {...args} />
      </Card>
    </div>
    <Title className="mt-5">Desktop</Title>
    <Card>
      <ComposedChart {...args} />
    </Card>
  </>
);

const DefaultTemplate: ComponentStory<typeof ComposedChart> = ({ ...args }) => (
  <Card>
    <ComposedChart {...args} />
  </Card>
);

const args = { 
    categories: {
        line: ["Successful Payments"],
        area: ['Test'],
        bar: ["Sales"],
    }, 
    index: "month" 
};

export const DefaultResponsive = ResponsiveTemplate.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
DefaultResponsive.args = {
  ...args,
  data,
};

export const WithCustomColors = ResponsiveTemplate.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
WithCustomColors.args = {
  ...args,
  data,
  colors: {
    line: ['red', 'green'],
    area: ['blue'],
    bar: ['lime']
  }
};
