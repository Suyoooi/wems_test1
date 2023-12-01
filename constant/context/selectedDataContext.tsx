import { SetStateAction, createContext, useContext } from "react";

interface SelectedDataContextType {
  serverData: any;
  setServerData: React.Dispatch<React.SetStateAction<any>>;
  sourceTypeData: any;
  setSourceTypeData: React.Dispatch<React.SetStateAction<any>>;
  destinationTypeData: any;
  setDestinationTypeData: React.Dispatch<React.SetStateAction<any>>;
  destinationNameData: any;
  setDestinationNameData: React.Dispatch<React.SetStateAction<any>>;
  sourceNameData: any;
  setSourceNameData: React.Dispatch<React.SetStateAction<any>>;
  selectorData: any;
  setSelectorData: any;
  onClickModal: boolean;
  setOnClickModal: React.Dispatch<SetStateAction<boolean>>;
}

export const SelectedDataContext = createContext<
  SelectedDataContextType | undefined
>(undefined);

export const useSelectedDataContext = () => {
  const context = useContext(SelectedDataContext);
  if (!context) {
    throw new Error("error");
  }
  return context;
};
