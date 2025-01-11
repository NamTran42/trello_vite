import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import ListColumns from "./ListColumns/ListColumns";
import { mapOrder } from "~/utils/sorts";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  // if U want to use pointerSensor U have to use additional css value "touch-action: 'none'" which U defined in Css-custom-dndKit
  // PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import Column from "./ListColumns/Column/Column";
import Card from "./ListColumns/Column/ListCards/Card/Card";
import { cloneDeep } from "lodash";

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: "ACTIVE_DRAG_ITEM_TYPE_COLUMN",
  CARD: "ACTIVE_DRAG_ITEM_TYPE_CARD",
};

function BoardContent({ board }) {
  const [orderedColumns, SetOrderedColumns] = useState([]);

  // At any one time only one element can be dragged or dropped (column or card).
  const [activeDargItemId, SetActiveDargItemId] = useState(null);
  const [activeDargItemType, SetActiveDargItemType] = useState(null);
  const [activeDargItemData, SetActiveDargItemData] = useState(null);
  const [oldColumnDraggingCard, SetOldColumnDraggingCard] = useState(null);

  useEffect(() => {
    SetOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);

  // Defined one point
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 }, // Require the mouse to move by 10 pixels before activating
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 }, // tolerance ~~ zoomSize of point
  });
  // Use many points, *Recommended to use both mouse and touch sensor for smooth experience on mobile devices
  const mySensors = useSensors(mouseSensor, touchSensor);

  const findColumnByCardId = (cardId) => {
    return orderedColumns.find((column) =>
      column?.cards?.map((card) => card._id).includes(cardId)
    );
  };

  const moveCardBetweenDiffColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    SetOrderedColumns((prevColumns) => {
      // Find index position of OverCard in Target Column (where activeCard will be drop)
      const overCardIndex = overColumn?.cards?.findIndex(
        (card) => card._id === overCardId
      );
      // logic to calculate "new cardIndex" (over/under of overCard) from "original library code"
      let newCardIndex;
      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height;
      const modifier = isBelowOverItem ? 1 : 0;

      newCardIndex =
        overCardIndex >= 0
          ? overCardIndex + modifier
          : overColumn?.cards?.length + 1;

      const nextColumns = cloneDeep(prevColumns);
      const nextActiveColumn = nextColumns.find(
        (column) => column._id === activeColumn._id
      );
      const nextOverColumn = nextColumns.find(
        (column) => column._id === overColumn._id
      );

      // Old Column
      if (nextActiveColumn) {
        // Delete card in Active Column(old column) when you drag card from old column to other column
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        );
        // Update cardOrderIds
        nextActiveColumn.cardOderIds = nextActiveColumn.cards.map(
          (card) => card._id
        );
      }

      // New Column
      if (nextOverColumn) {
        // Check if the card being dragged already exists in overColumn, if so, delete this card
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        );
        // Add the card being dragged to overColumn according to the position of the new index (toSpliced return new arr, not origin arr)
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id,
        });
        // Update cardOrderIds
        nextOverColumn.cardOderIds = nextOverColumn.cards.map(
          (card) => card._id
        );
      }

      return nextColumns;
    });
  };

  const handleDragStart = (event) => {
    SetActiveDargItemId(event?.active?.id);
    SetActiveDargItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );
    SetActiveDargItemData(event?.active?.data?.current);
    // Only action when dragging card
    if (event?.active?.data?.current?.columnId) {
      SetOldColumnDraggingCard(findColumnByCardId(event?.active?.id));
    }
  };

  // Drag process 1 element
  const handleDragOver = (event) => {
    if (activeDargItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return;
    const { active, over } = event;
    if (!active || !over) return;

    const {
      id: activeDraggingCardId, // activeDraggingCard: Card is dragging
      data: { current: activeDraggingCardData },
    } = active;
    const { id: overCardId } = over; // overCard: card interact with over/under card is draged
    // Find 2 columns throught CardId
    const activeColumn = findColumnByCardId(activeDraggingCardId);
    const overColumn = findColumnByCardId(overCardId);
    if (!activeColumn || !overColumn) return;
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDiffColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      );
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!active || !over) return;
    if (activeDargItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const {
        id: activeDraggingCardId, // activeDraggingCard: Card is dragging
        data: { current: activeDraggingCardData },
      } = active;
      const { id: overCardId } = over; // overCard: card interact with over/under card is draged
      // Find 2 columns throught CardId
      const activeColumn = findColumnByCardId(activeDraggingCardId);
      const overColumn = findColumnByCardId(overCardId);
      if (!activeColumn || !overColumn) return;

      if (oldColumnDraggingCard._id !== overColumn._id) {
        moveCardBetweenDiffColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        );
      } else {
        const oldCardIndex = oldColumnDraggingCard?.cards?.findIndex(
          (i) => i._id === activeDargItemId
        );
        const newCardIndex = overColumn?.cards?.findIndex(
          (i) => i._id === overCardId
        );
        const dndOrderedCards = arrayMove(
          oldColumnDraggingCard?.cards,
          oldCardIndex,
          newCardIndex
        );
        SetOrderedColumns((prevColumns) => {
          const nextColumns = cloneDeep(prevColumns);
          const targetColumn = nextColumns.find(
            (i) => i._id === overColumn._id
          );
          targetColumn.cards = dndOrderedCards;
          targetColumn.cardOrderIds = dndOrderedCards.map((card) => card._id);
          return nextColumns;
        });
      }
    }

    if (activeDargItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        // get old index
        const oldColumnIndex = orderedColumns.findIndex(
          (i) => i._id === active.id
        );
        // get new index
        const newColumnIndex = orderedColumns.findIndex(
          (i) => i._id === over.id
        );
        // use arrayMove of dndKit to sort array of original column
        const dndOrderedColumns = arrayMove(
          orderedColumns,
          oldColumnIndex,
          newColumnIndex
        );
        // const dndOrderedColumnsIds = dndOrderedColumns.map((i) => i._id); use to update _id_sort api
        SetOrderedColumns(dndOrderedColumns);
      }
    }
    SetActiveDargItemId(null);
    SetActiveDargItemType(null);
    SetActiveDargItemData(null);
    SetOldColumnDraggingCard(null);
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: "0.5" } },
    }),
  };

  return (
    <DndContext
      sensors={mySensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box
        maxWidth
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
          height: (theme) => theme.trello.boardContentHeight,
          p: "10px 0",
        }}
      >
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={dropAnimation}>
          {!activeDargItemType && null}
          {activeDargItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <Column column={activeDargItemData} />
          )}
          {activeDargItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
            <Card card={activeDargItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  );
}

export default BoardContent;
