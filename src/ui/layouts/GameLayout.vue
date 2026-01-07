<script setup lang="ts">
    import { useRouter } from 'vue-router';
    import HeaderBar from '../components/common/HeaderBar.vue';

    const router = useRouter();

    const hardReset = () => {
        if (confirm("⚠️ HARD RESET: All progress will be lost. Are you sure?")) {
            localStorage.removeItem('summoners-manager-save');
            window.location.reload();
        }
    };
</script>

<template>
    <div class="flex h-screen bg-[#0f1115] text-gray-100 font-sans overflow-hidden">
        
        <aside class="w-20 lg:w-64 shrink-0 bg-[#161920] border-r border-gray-800 flex flex-col transition-all duration-300">
            <div class="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-gray-800">
                <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
                    S
                </div>
                <span class="ml-3 font-bold tracking-wider text-gray-200 hidden lg:block">MANAGER</span>
            </div>    

            <nav class="flex-1 py-6 px-2 lg:px-4 space-y-1">
                <router-link to="/" class="nav-item">
                    <span class="icon">🏠</span> <span class="label">Dashboard</span>
                </router-link>
                <router-link to="/my-team" class="nav-item">
                    <span class="icon">🛡️</span> <span class="label">My Team</span>
                </router-link>
                <router-link to="/soloq" class="nav-item">
                    <span class="icon">🔥</span> <span class="label">Solo Queue</span> 
                </router-link>
                <router-link to="/market" class="nav-item">
                    <span class="icon">⚖️</span> <span class="label">Market</span>
                </router-link>
                <router-link to="/standings" class="nav-item">
                    <span class="icon">🏆</span> <span class="label">Standings</span>
                </router-link>
                <router-link to="/schedule" class="nav-item">
                    <span class="icon">📅</span> <span class="label">Schedule</span>
                </router-link>
                <div class="pt-4 pb-2">
                    <div class="h-px bg-gray-800 mx-2"></div>
                </div>
                <router-link to="/stats" class="nav-item">
                    <span class="icon">📊</span> <span class="label">Statistics</span>
                </router-link>
            </nav>

            <div class="p-4 border-t border-gray-800">
                <button @click="hardReset" class="w-full flex items-center justify-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-900/20 py-2 rounded transition-colors group">
                    <span>⚠️</span> <span class="hidden lg:block">RESET SAVE</span>
                </button>
            </div>
        </aside>

        <div class="flex-1 flex flex-col min-w-0">
            <HeaderBar />
            
            <main class="flex-1 overflow-y-auto bg-linear-to-br from-[#0f1115] to-[#13161c] p-6 lg:p-8">
                <slot></slot>
            </main>
        </div>
    </div>
</template>
<style scoped>
@reference "tailwindcss";

.nav-item {
    @apply flex items-center gap-3 px-3 py-3 rounded-lg text-gray-400 font-medium transition-all duration-200 hover:bg-gray-800 hover:text-white mb-1;
}
.nav-item.router-link-active {
    @apply bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-sm;
}
.nav-item .icon {
    @apply text-xl w-6 text-center;
}
.nav-item .label {
    @apply hidden lg:block;
}
</style>