import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { taskListApi } from "@/services/taskList.api";
import type { TaskList, TaskItem } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  LogOut,
  ListTodo,
  ChevronRight,
} from "lucide-react";
import { taskItemApi } from "@/services/taskItem.api";

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [lists, setLists] = useState<TaskList[]>([]);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [items, setItems] = useState<TaskItem[]>([]);

  // New list
  const [newListName, setNewListName] = useState("");
  // Edit list
  const [editingListId, setEditingListId] = useState<number | null>(null);
  const [editingListName, setEditingListName] = useState("");
  // New item
  const [newItemDesc, setNewItemDesc] = useState("");
  // Edit item
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingItemDesc, setEditingItemDesc] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    refreshLists();
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedListId !== null) {
      refreshItems();
    }
  }, [selectedListId]);

  const refreshLists = async () => {
    try {
      const all = await taskListApi.getAll();
      setLists(all);
      if (selectedListId === null && all.length > 0)
        setSelectedListId(all[0].id);
    } catch (error) {
      console.error("Erro ao carregar listas:", error);
    }
  };

  const refreshItems = async () => {
    if (selectedListId === null) return;
    try {
      const allItems = await taskItemApi.getAll();
      setItems(allItems.filter((item) => item.taskListId === selectedListId));
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    }
  };

  // List CRUD
  const addList = async () => {
    if (!newListName.trim()) return;
    try {
      await taskListApi.create({ name: newListName.trim(), userId: user!.id });
      setNewListName("");
      await refreshLists();
    } catch (error) {
      console.error("Erro ao criar lista:", error);
    }
  };

  const saveListName = async (id: number) => {
    if (!editingListName.trim()) return;
    try {
      await taskListApi.update(id, { name: editingListName.trim() });
      setEditingListId(null);
      await refreshLists();
    } catch (error) {
      console.error("Erro ao atualizar lista:", error);
    }
  };

  const deleteList = async (id: number) => {
    try {
      await taskListApi.delete(id);
      if (selectedListId === id) setSelectedListId(null);
      await refreshLists();
    } catch (error) {
      console.error("Erro ao deletar lista:", error);
    }
  };

  // Item CRUD
  const addItem = async () => {
    if (!newItemDesc.trim() || selectedListId === null) return;
    try {
      await taskItemApi.create({
        description: newItemDesc.trim(),
        taskListId: selectedListId,
      });
      setNewItemDesc("");
      await refreshItems();
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
    }
  };

  const toggleItem = async (item: TaskItem) => {
    try {
      await taskItemApi.update(item.id, {
        description: item.description,
        status: item.status === 0 ? 1 : 0,
      });
      await refreshItems();
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  };

  const saveItemDesc = async (id: number) => {
    const item = items.find((i) => i.id === id);
    if (!item || !editingItemDesc.trim()) return;
    try {
      await taskItemApi.update(id, {
        description: editingItemDesc.trim(),
        status: item.status,
      });
      setEditingItemId(null);
      await refreshItems();
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  };

  const deleteItem = async (id: number) => {
    try {
      await taskItemApi.delete(id);
      await refreshItems();
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  const handleLogout = () => {
    logout();
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const selectedList = lists.find((l) => l.id === selectedListId);

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/50 bg-card/60 px-6 backdrop-blur">
        <div className="flex items-center gap-2">
          <ListTodo className="h-5 w-5 text-primary" />
          <span className="font-mono text-sm font-semibold tracking-wide">
            ToDo List
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{user?.name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              handleLogout();
            }}
          >
            <LogOut className="mr-1 h-4 w-4" /> Sair
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="flex w-64 shrink-0 flex-col border-r border-border/50 bg-sidebar">
          <div className="p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Listas
            </h2>
            <div className="flex gap-2">
              <Input
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addList()}
                placeholder="Nova lista..."
                className="h-8 bg-muted/50 text-sm"
              />
              <Button size="sm" className="h-8 px-2" onClick={addList}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-2 pb-4">
            {lists.map((list) => (
              <div
                key={list.id}
                className={`group mb-1 flex items-center rounded-lg px-3 py-2 text-sm transition-colors cursor-pointer ${
                  selectedListId === list.id
                    ? "bg-primary/20 text-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
                onClick={() => setSelectedListId(list.id)}
              >
                {editingListId === list.id ? (
                  <div className="flex flex-1 items-center gap-1">
                    <Input
                      value={editingListName}
                      onChange={(e) => setEditingListName(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && saveListName(list.id)
                      }
                      className="h-6 bg-muted/50 text-sm"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        saveListName(list.id);
                      }}
                      className="text-primary hover:text-primary/80"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingListId(null);
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <ChevronRight
                      className={`mr-2 h-3.5 w-3.5 transition-transform ${selectedListId === list.id ? "rotate-90" : ""}`}
                    />
                    <span className="flex-1 truncate">{list.name}</span>
                    <div className="hidden gap-1 group-hover:flex">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingListId(list.id);
                          setEditingListName(list.name);
                        }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteList(list.id);
                        }}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex flex-1 flex-col overflow-hidden p-6">
          {selectedList ? (
            <>
              <h1 className="mb-6 text-2xl font-bold">{selectedList.name}</h1>

              {/* Add item */}
              <div className="mb-6 flex gap-2">
                <Input
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addItem()}
                  placeholder="Adicionar tarefa..."
                  className="bg-muted/50"
                />
                <Button onClick={addItem}>
                  <Plus className="mr-1 h-4 w-4" /> Adicionar
                </Button>
              </div>

              {/* Items */}
              <div className="flex-1 space-y-2 overflow-y-auto">
                {items.length === 0 && (
                  <p className="py-8 text-center text-muted-foreground">
                    Nenhuma tarefa nesta lista
                  </p>
                )}
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="group flex items-center gap-3 rounded-lg border border-border/50 bg-card/60 px-4 py-3 transition-colors hover:bg-card"
                  >
                    <Checkbox
                      checked={item.status === 1}
                      onCheckedChange={() => toggleItem(item)}
                      className="border-muted-foreground data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                    />
                    {editingItemId === item.id ? (
                      <div className="flex flex-1 items-center gap-2">
                        <Input
                          value={editingItemDesc}
                          onChange={(e) => setEditingItemDesc(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && saveItemDesc(item.id)
                          }
                          className="h-8 bg-muted/50 text-sm"
                          autoFocus
                        />
                        <button
                          onClick={() => saveItemDesc(item.id)}
                          className="text-primary hover:text-primary/80"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditingItemId(null)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span
                          className={`flex-1 text-sm ${item.status === 1 ? "text-muted-foreground line-through" : ""}`}
                        >
                          {item.description}
                        </span>
                        <div className="hidden gap-1 group-hover:flex">
                          <button
                            onClick={() => {
                              setEditingItemId(item.id);
                              setEditingItemDesc(item.description);
                            }}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-muted-foreground">
                Selecione ou crie uma lista para começar
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
