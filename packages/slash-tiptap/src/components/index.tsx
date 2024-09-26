import Command from "./command";
import Item from "./item";
import SlashCmdRoot from "./root";
import { Command as Cmd } from "cmdk";

const SlashCommand = {
  Root: SlashCmdRoot,
  Cmd: Command,
  List: Cmd.List,
  Item: Item,
  Empty: Cmd.Empty,
  Loading: Cmd.Loading,
  Separator: Cmd.Separator,
  Group: Cmd.Group,
};

export default SlashCommand;
