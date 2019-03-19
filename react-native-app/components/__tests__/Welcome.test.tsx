import 'react-native';
import React from "react";
import renderer from "react-test-renderer"
import { Welcome } from "../Welcome";
import { NavigationScreenProp } from "react-navigation";

test("renders correctly with defaults", () => {
  const mockNavigation: NavigationScreenProp<any, any> = { navigate: jest.fn } as any;
  const button = renderer.create(<Welcome navigation={mockNavigation} />).toJSON()
  expect(button).toMatchSnapshot()
})