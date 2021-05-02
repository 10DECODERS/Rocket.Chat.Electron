import { AddRepresentationOptions } from 'electron';

type IconRepresentation = Omit<AddRepresentationOptions, 'scaleFactor'>;

export type RootWindowIcon = {
  icon: IconRepresentation[];
  overlay?: IconRepresentation[];
};
