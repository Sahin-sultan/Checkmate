import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Wallet, TrendingUp, TrendingDown, IndianRupee, Trash2 } from "lucide-react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
} from "recharts";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export interface Transaction {
    id: string;
    amount: number;
    category: string;
    date: string;
    description: string;
    type: "expense" | "income";
}

interface FinanceTabProps {
    transactions: Transaction[];
    onAddTransaction: (transaction: Omit<Transaction, "id">) => void;
    onDeleteTransaction: (id: string) => void;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring" as const,
            stiffness: 260,
            damping: 20,
        },
    },
};

const FinanceTab = ({ transactions, onAddTransaction, onDeleteTransaction }: FinanceTabProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Food");
    const [description, setDescription] = useState("");
    const [type, setType] = useState<"expense" | "income">("expense");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (amount) {
            onAddTransaction({
                amount: parseFloat(amount),
                category,
                description: description.trim() || "Untitled",
                date: new Date().toISOString(),
                type,
            });
            setAmount("");
            setDescription("");
            setCategory("Food");
            setIsOpen(false);
        }
    };

    const stats = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        let thisMonthSpent = 0;
        let lastMonthSpent = 0;
        let totalIncome = 0;
        let totalExpenses = 0;

        const categoryData: Record<string, number> = {};

        transactions.forEach((t) => {
            const tDate = new Date(t.date);
            const isThisMonth =
                tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
            const isLastMonth =
                tDate.getMonth() === lastMonth && tDate.getFullYear() === lastMonthYear;

            if (t.type === "expense") {
                totalExpenses += t.amount;
                if (isThisMonth) {
                    thisMonthSpent += t.amount;
                    categoryData[t.category] = (categoryData[t.category] || 0) + t.amount;
                }
                if (isLastMonth) {
                    lastMonthSpent += t.amount;
                }
            } else {
                totalIncome += t.amount;
            }
        });

        const pieData = Object.entries(categoryData).map(([name, value]) => ({
            name,
            value,
        }));

        return {
            thisMonthSpent,
            lastMonthSpent,
            totalIncome,
            totalExpenses,
            pieData,
            balance: totalIncome - totalExpenses,
        };
    }, [transactions]);

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
        >
            {/* Summary Cards */}
            <motion.div variants={item} className="grid gap-4 md:grid-cols-3">
                <div className="card-earthy">
                    <div className="flex flex-row items-center justify-between p-6 pb-2">
                        <h3 className="text-sm font-medium text-zinc-400">
                            Total Balance
                        </h3>
                        <Wallet className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="p-6 pt-0">
                        <div className="text-2xl font-bold text-white">
                            ₹{stats.balance.toFixed(2)}
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">
                            Current Available Funds
                        </p>
                    </div>
                </div>
                <div className="card-earthy">
                    <div className="flex flex-row items-center justify-between p-6 pb-2">
                        <h3 className="text-sm font-medium text-zinc-400">
                            Spent This Month
                        </h3>
                        <TrendingDown className="h-4 w-4 text-rose-500" />
                    </div>
                    <div className="p-6 pt-0">
                        <div className="text-2xl font-bold text-white">
                            ₹{stats.thisMonthSpent.toFixed(2)}
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">
                            {stats.lastMonthSpent > 0
                                ? `${((stats.thisMonthSpent / stats.lastMonthSpent) * 100).toFixed(0)}% of last month`
                                : "No data for last month"}
                        </p>
                    </div>
                </div>
                <div className="card-earthy">
                    <div className="flex flex-row items-center justify-between p-6 pb-2">
                        <h3 className="text-sm font-medium text-zinc-400">
                            Last Month Spend
                        </h3>
                        <IndianRupee className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="p-6 pt-0">
                        <div className="text-2xl font-bold text-white">
                            ₹{stats.lastMonthSpent.toFixed(2)}
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">Previous Month Total</p>
                    </div>
                </div>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Spending Chart */}
                <motion.div variants={item} className="col-span-1">
                    <div className="card-earthy h-full">
                        <div className="p-6">
                            <h3 className="text-white">Monthly Spending by Category</h3>
                        </div>
                        <div className="p-6 pt-0">
                            <div className="h-[220px]">
                                {stats.pieData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={stats.pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {stats.pieData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={COLORS[index % COLORS.length]}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-full items-center justify-center text-zinc-500">
                                        No expenses this month
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Recent Transactions */}
                <motion.div variants={item} className="col-span-1">
                    <div className="card-earthy h-full">
                        <div className="flex flex-row items-center justify-between p-6">
                            <h3 className="text-white">Recent Transactions</h3>
                            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                        <Plus className="mr-2 h-4 w-4" /> Add
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-white">
                                    <DialogHeader>
                                        <DialogTitle>Add Transaction</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Type</Label>
                                            <Select
                                                value={type}
                                                onValueChange={(val: "expense" | "income") => setType(val)}
                                            >
                                                <SelectTrigger className="bg-zinc-900 border-zinc-800">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                                    <SelectItem value="expense">Expense</SelectItem>
                                                    <SelectItem value="income">Income</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Amount</Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                placeholder="0.00"
                                                className="bg-zinc-900 border-zinc-800"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Category</Label>
                                            <Select value={category} onValueChange={setCategory}>
                                                <SelectTrigger className="bg-zinc-900 border-zinc-800">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                                    <SelectItem value="Food">Food</SelectItem>
                                                    <SelectItem value="Transport">Transport</SelectItem>
                                                    <SelectItem value="Utilities">Utilities</SelectItem>
                                                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                                                    <SelectItem value="Shopping">Shopping</SelectItem>
                                                    <SelectItem value="Health">Health</SelectItem>
                                                    <SelectItem value="Salary">Salary</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Description</Label>
                                            <Input
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="e.g., Grocery Shopping"
                                                className="bg-zinc-900 border-zinc-800"
                                            />
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                                Add Transaction
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="p-6 pt-0">
                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                                {transactions.length > 0 ? (
                                    transactions.slice().reverse().map((t) => (
                                        <div
                                            key={t.id}
                                            className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 p-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex h-10 w-10 items-center justify-center rounded-full ${t.type === "expense"
                                                        ? "bg-rose-500/10 text-rose-500"
                                                        : "bg-emerald-500/10 text-emerald-500"
                                                        }`}
                                                >
                                                    {t.type === "expense" ? (
                                                        <TrendingDown className="h-5 w-5" />
                                                    ) : (
                                                        <TrendingUp className="h-5 w-5" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{t.description}</p>
                                                    <p className="text-xs text-zinc-500">
                                                        {new Date(t.date).toLocaleDateString()} • {t.category}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={`font-semibold ${t.type === "expense" ? "text-rose-500" : "text-emerald-500"
                                                        }`}
                                                >
                                                    {t.type === "expense" ? "-" : "+"}₹{t.amount.toFixed(2)}
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10"
                                                    onClick={() => onDeleteTransaction(t.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-zinc-500">
                                        No transactions yet
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default FinanceTab;
