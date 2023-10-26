import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Card, CustomTooltip, Title } from "components";

export default {
    title: "Tremor/UtilElements/CustomTooltip",
    component: CustomTooltip,
} as ComponentMeta<typeof CustomTooltip>;
// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const Template: ComponentStory<typeof CustomTooltip> = (args) => (
    <Card>
        <CustomTooltip {...args}>{args.children}</CustomTooltip>
    </Card>
);
const args = {
    children: <button className="w-fit bg-blue-500 p-2 rounded-md text-white">Hover me</button>
}

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writingstories/args
Default.args = {
    ...args,
    content: "Tooltip",
};

export const VeryLongCOntent = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writingstories/args
VeryLongCOntent.args = {
    ...args,
    content: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corrupti odit adipisci velit cumque voluptas et blanditiis commodi ea dignissimos, repellat, ratione ipsam itaque culpa optio aliquam quo. Repudiandae, sequi hic.",
    className: "mt-80"
};

export const CustonContent = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writingstories/args
CustonContent.args = {
    ...args,
    content:
        <div className="w-40">
            <div className="flex justify-between gap-2 border-b border-gray-400">
                <div>
                    <p className="text-lg text-medium">Xxxxxx</p>
                    <p className="text-gray-500">xxxx</p>
                </div>
                <div>
                    <p className="text-gray-500">xxxx</p>
                </div>
            </div>
            <div className="flex justify-between gap-2">
                <p className="text-gray-500">xxxx</p>
                <p className="text-gray-500">xxxx</p>
            </div>
        </div>
};

const CustomTooltipContent = () => {
    return (
        <div className="w-40">
            <div className="flex justify-between gap-2 border-b border-gray-400">
                <div>
                    <p className="text-lg text-medium">Xxxxxx</p>
                    <p className="text-gray-500">xxxx</p>
                </div>
                <div>
                    <p className="text-gray-500">xxxx</p>
                </div>
            </div>
            <div className="flex justify-between gap-2">
                <p className="text-gray-500">xxxx</p>
                <p className="text-gray-500">xxxx</p>
            </div>
        </div>
    )
}

const Template2: ComponentStory<typeof CustomTooltip> = () => (
    <Card>
        <Title className="mb-10">Hover bars</Title>
        <div className="flex gap-1">
            {Array.from({length: 20}).map((e, i) => {
                return (
                    <CustomTooltip 
                        content={<CustomTooltipContent/>}
                    >
                        <div className="h-10 w-4 bg-blue-500 p-2 rounded-md text-white hover:bg-blue-700 transition "></div>
                    </CustomTooltip>
                )
            })}
        </div>
    </Card>
);

export const Default2 = Template2.bind({});

