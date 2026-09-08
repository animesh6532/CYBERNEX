class EgressTracker:
    def __init__(self):
        self.external_calls = 0
        self.cloud_llm_calls = 0

    def record_call(self, is_external: bool, is_cloud_llm: bool = False):
        if is_external:
            self.external_calls += 1
        if is_cloud_llm:
            self.cloud_llm_calls += 1


egress_tracker = EgressTracker()
