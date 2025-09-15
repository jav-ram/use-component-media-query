export type ContainerDimensions = {
  width: number,
  height: number,
}

export type ContainterContextValueType = {
  register: (id: string, node: HTMLDivElement) => void,
  unregister: (id: string) => void,
  getDimensions: (id: string) => ContainerDimensions,
  containers: Record<string, ContainerDimensions>,
}

export type ContainersType = Record<string, ContainerDimensions>;